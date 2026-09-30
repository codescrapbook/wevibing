#!/usr/bin/env ruby
# frozen_string_literal: true

# Double opt-in subscription API for We Vibing notifications.
# An address is stored as subscribed only after the confirmation token is posted.
#
# Environment:
#   SUBSCRIBE_PORT          default 4001
#   SUBSCRIBE_HOST          default 0.0.0.0
#   SUBSCRIBE_DATA_DIR      default tmp/subscribe
#   SUBSCRIBE_CONFIRM_URL   default http://127.0.0.1:4000/wevibing/confirm/
#   SUBSCRIBE_DEV_MAILBOX   set to 1 to expose captured mail at /dev/mailbox
#   MAIL_FROM               default notifications@wevibing.com
#   SMTP_ADDRESS, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_DOMAIN, SMTP_STARTTLS

require "cgi"
require "fileutils"
require "json"
require "securerandom"
require "time"
require "uri"
require "webrick"

ROOT = File.expand_path("..", __dir__)
DATA_DIR = File.expand_path(ENV.fetch("SUBSCRIBE_DATA_DIR", "tmp/subscribe"), ROOT)
STORE_PATH = File.join(DATA_DIR, "subscribers.json")
MAIL_DIR = File.join(DATA_DIR, "mail")
CONFIRM_URL = ENV.fetch("SUBSCRIBE_CONFIRM_URL", "http://127.0.0.1:4000/wevibing/confirm/")
MAIL_FROM = ENV.fetch("MAIL_FROM", "notifications@wevibing.com")
DEV_MAILBOX = ENV["SUBSCRIBE_DEV_MAILBOX"] == "1"
TOKEN_TTL = 48 * 60 * 60
EMAIL_PATTERN = /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/

class SubscribeStore
  def initialize(path)
    @path = path
    @mutex = Mutex.new
    FileUtils.mkdir_p(File.dirname(path))
    @mutex.synchronize { save(empty_data) unless File.exist?(path) }
  end

  def request_confirmation(email)
    @mutex.synchronize do
      data = load
      if data["subscribers"].any? { |row| row["email"] == email }
        return { status: :already_subscribed, email: email }
      end

      data["pending"].reject! { |row| row["email"] == email }
      now = Time.now.utc
      token = SecureRandom.urlsafe_base64(32)
      data["pending"] << {
        "email" => email,
        "token" => token,
        "created_at" => now.iso8601,
        "expires_at" => (now + TOKEN_TTL).iso8601
      }
      save(data)
      { status: :pending, email: email, token: token }
    end
  end

  def confirm(token)
    @mutex.synchronize do
      data = load
      pending = data["pending"].find { |row| secure_token_match?(row["token"], token) }
      return { status: :invalid } unless pending

      if Time.iso8601(pending["expires_at"]) < Time.now.utc
        data["pending"].reject! { |row| row["email"] == pending["email"] }
        save(data)
        return { status: :expired }
      end

      email = pending["email"]
      data["pending"].reject! { |row| row["email"] == email }
      unless data["subscribers"].any? { |row| row["email"] == email }
        data["subscribers"] << { "email" => email, "confirmed_at" => Time.now.utc.iso8601 }
      end
      save(data)
      { status: :confirmed, email: email }
    end
  end

  private

  def empty_data
    { "pending" => [], "subscribers" => [] }
  end

  def load
    JSON.parse(File.read(@path))
  rescue JSON::ParserError, Errno::ENOENT
    empty_data
  end

  def save(data)
    temp = "#{@path}.tmp"
    File.write(temp, JSON.pretty_generate(data))
    File.chmod(0o600, temp)
    File.rename(temp, @path)
  end

  def secure_token_match?(stored, provided)
    return false if stored.to_s.empty? || provided.to_s.empty?
    return false unless stored.bytesize == provided.bytesize

    Rackless.secure_compare(stored, provided)
  end
end

module Rackless
  module_function

  def secure_compare(left, right)
    diff = 0
    left.bytes.zip(right.bytes) { |a, b| diff |= a ^ b }
    diff.zero?
  end
end

class ConfirmationMailer
  def self.deliver(email:, token:)
    url = confirmation_url(token)
    body = <<~BODY
      Confirm your email to get We Vibing notifications.

      After you confirm, we will email you about:
      - Upcoming book clubs
      - Streams when they go live
      - New blog posts

      You are not subscribed until you open this link:
      #{url}

      If you did not ask for this, ignore this email. The link expires in 48 hours.
    BODY

    message = <<~MESSAGE
      From: We Vibing <#{MAIL_FROM}>
      To: #{email}
      Subject: Confirm your We Vibing notifications
      Date: #{Time.now.utc.rfc2822}
      MIME-Version: 1.0
      Content-Type: text/plain; charset=UTF-8

      #{body}
    MESSAGE

    if ENV["SMTP_ADDRESS"] && !ENV["SMTP_ADDRESS"].empty?
      deliver_smtp(email, message)
    else
      deliver_local(email, message)
    end
    url
  end

  def self.confirmation_url(token)
    separator = CONFIRM_URL.include?("?") ? "&" : "?"
    "#{CONFIRM_URL}#{separator}token=#{CGI.escape(token)}"
  end

  def self.deliver_smtp(email, message)
    require "net/smtp"
    address = ENV.fetch("SMTP_ADDRESS")
    port = Integer(ENV.fetch("SMTP_PORT", "587"))
    smtp = Net::SMTP.new(address, port)
    smtp.enable_starttls_auto if ENV.fetch("SMTP_STARTTLS", "1") == "1"
    smtp.start(
      ENV.fetch("SMTP_DOMAIN", "wevibing.com"),
      ENV["SMTP_USER"],
      ENV["SMTP_PASSWORD"],
      :plain
    ) do |client|
      client.send_message(message, MAIL_FROM, email)
    end
  end

  def self.deliver_local(email, message)
    FileUtils.mkdir_p(MAIL_DIR)
    stamp = Time.now.utc.strftime("%Y%m%dT%H%M%S%L")
    safe_email = email.gsub(/[^a-z0-9@.]+/i, "_")
    path = File.join(MAIL_DIR, "#{stamp}-#{safe_email}.eml")
    File.write(path, message)
    File.chmod(0o600, path)
    warn "Confirmation email captured at #{path}"
  end
end

class SubscribeServlet < WEBrick::HTTPServlet::AbstractServlet
  def initialize(server, store)
    super(server)
    @store = store
  end

  def do_OPTIONS(_req, res)
    cors(res)
    res.status = 204
  end

  def do_GET(req, res)
    cors(res)
    case req.path
    when "/health"
      json_response(res, 200, { "ok" => true })
    when "/dev/mailbox"
      dev_mailbox(res)
    else
      json_response(res, 404, { "ok" => false, "message" => "Not found." })
    end
  end

  def do_POST(req, res)
    cors(res)
    case req.path
    when "/subscribe"
      subscribe(req, res)
    when "/confirm"
      confirm(req, res)
    else
      json_response(res, 404, { "ok" => false, "message" => "Not found." })
    end
  end

  private

  def subscribe(req, res)
    email = normalize_email(params(req)["email"])
    unless email&.match?(EMAIL_PATTERN) && email.length <= 254
      return respond(req, res, 422, false, "Enter a valid email address.")
    end

    result = @store.request_confirmation(email)
    if result[:status] == :already_subscribed
      return respond(req, res, 200, true, "This email is already confirmed for notifications.", "already_subscribed")
    end

    begin
      ConfirmationMailer.deliver(email: email, token: result[:token])
    rescue StandardError => e
      warn "Confirmation email failed: #{e.class}: #{e.message}"
      return respond(req, res, 502, false, "We could not send the confirmation email. Try again.")
    end

    respond(
      req,
      res,
      200,
      true,
      "Check your email and open the confirmation link. You are subscribed only after that.",
      "pending"
    )
  end

  def confirm(req, res)
    token = params(req)["token"].to_s
    result = @store.confirm(token)
    case result[:status]
    when :confirmed
      respond(req, res, 200, true, "You're subscribed. We'll email you about book clubs, live streams, and new posts.", "confirmed")
    when :expired
      respond(req, res, 400, false, "This confirmation link has expired. Subscribe again from the homepage.", "expired")
    else
      respond(req, res, 400, false, "This confirmation link is invalid.", "invalid")
    end
  end

  def dev_mailbox(res)
    unless DEV_MAILBOX
      return json_response(res, 404, { "ok" => false, "message" => "Not found." })
    end

    FileUtils.mkdir_p(MAIL_DIR)
    messages = Dir[File.join(MAIL_DIR, "*.eml")].sort.reverse.map do |path|
      raw = File.read(path)
      url = raw[/https?:\/\/\S+/]
      "<article><h2>#{h(File.basename(path))}</h2><pre>#{h(raw)}</pre>" \
        "#{url ? %(<p><a href="#{h(url)}">Open confirmation link</a></p>) : ""}</article>"
    end
    body = messages.empty? ? "<p>No confirmation emails yet.</p>" : messages.join
    res.status = 200
    res["Content-Type"] = "text/html; charset=utf-8"
    res.body = <<~HTML
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Confirmation inbox</title>
          <style>
            body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #0b0f14; color: #e6edf3; }
            main { max-width: 800px; margin: 0 auto; padding: 32px 20px; }
            a { color: #7c5cff; }
            pre { white-space: pre-wrap; background: #101722; border: 1px solid #233041; border-radius: 12px; padding: 16px; }
            article { margin-bottom: 28px; }
          </style>
        </head>
        <body>
          <main>
            <h1>Confirmation inbox</h1>
            <p>SMTP is not configured, so double opt-in messages are captured here instead of being delivered.</p>
            #{body}
          </main>
        </body>
      </html>
    HTML
  end

  def params(req)
    body = req.body.to_s
    content_type = req["content-type"].to_s
    if content_type.include?("application/json")
      parsed = body.empty? ? {} : JSON.parse(body)
      return parsed.transform_keys(&:to_s)
    end
    URI.decode_www_form(body).to_h
  rescue JSON::ParserError, ArgumentError
    {}
  end

  def normalize_email(value)
    value.to_s.strip.downcase
  end

  def respond(req, res, status, ok, message, state = nil)
    payload = { "ok" => ok, "message" => message }
    payload["status"] = state if state
    if req["content-type"].to_s.include?("application/json") || req["accept"].to_s.include?("application/json")
      json_response(res, status, payload)
    else
      res.status = status
      res["Content-Type"] = "text/html; charset=utf-8"
      res.body = "<!doctype html><meta charset=\"utf-8\"><title>#{h(message)}</title><p>#{h(message)}</p>"
    end
  end

  def json_response(res, status, payload)
    res.status = status
    res["Content-Type"] = "application/json"
    res.body = JSON.generate(payload)
  end

  def cors(res)
    res["Access-Control-Allow-Origin"] = "*"
    res["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    res["Access-Control-Allow-Headers"] = "Content-Type, Accept"
  end

  def h(value)
    CGI.escapeHTML(value.to_s)
  end
end

store = SubscribeStore.new(STORE_PATH)
port = Integer(ENV.fetch("SUBSCRIBE_PORT", "4001"))
host = ENV.fetch("SUBSCRIBE_HOST", "0.0.0.0")
server = WEBrick::HTTPServer.new(BindAddress: host, Port: port, AccessLog: [], Logger: WEBrick::Log.new($stderr))
server.mount "/", SubscribeServlet, store
trap("INT") { server.shutdown }
trap("TERM") { server.shutdown }
warn "Subscribe API on http://#{host}:#{port} (dev mailbox: #{DEV_MAILBOX})"
server.start
