# frozen_string_literal: true

# While coming_soon is on, keep post and stream URLs from leaking through
# the generated feed and sitemap. HTML pages are replaced in the layout.
Jekyll::Hooks.register :site, :post_write do |site|
  next unless site.config["coming_soon"]

  %w[feed.xml sitemap.xml].each do |name|
    path = site.in_dest_dir(name)
    File.delete(path) if File.exist?(path)
  end
end
