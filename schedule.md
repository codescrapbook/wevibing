---
layout: page
title: Stream schedule
subtitle: "Live AI coding on Twitch. All times Central (CT)."
permalink: /schedule/
---

<div class="section">
  <div class="twitch-embed video-embed">
    <iframe
      src="https://player.twitch.tv/?channel={{ site.twitch.channel }}&parent=wevibing.com&parent=www.wevibing.com&muted=true"
      title="We Vibing on Twitch"
      loading="lazy"
      allowfullscreen
      frameborder="0"></iframe>
  </div>
  <div class="button-row">
    <a class="btn btn-primary" href="{{ site.twitch.url }}" target="_blank" rel="noopener">Follow on Twitch</a>
    <a class="btn" href="{{ site.twitch.schedule_url }}" target="_blank" rel="noopener">Schedule on Twitch</a>
  </div>
</div>

<div class="section">
  <div class="card">
    <h2>Upcoming streams</h2>
    {% include schedule-list.html %}
    <p class="subscribe-note">Times can shift. The <a href="{{ site.twitch.schedule_url }}" target="_blank" rel="noopener">Twitch schedule</a> is always the latest.</p>
  </div>
</div>

<div class="section" id="subscribe">
  <div class="card subscribe-card">
    <h2>Get stream alerts by email</h2>
    <p>Get an email when a stream is scheduled or goes live, and when new blog posts come out.</p>
    {% include subscribe-form.html %}
  </div>
</div>
