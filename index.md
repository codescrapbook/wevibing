---
layout: page
title: We Vibing
hide_title: true
permalink: /
---

<section class="hero">
  <h1>Code with AI, live. Start with vibe coding, then build agents with guardrails.</h1>
  <p>
    We Vibing is a free place to learn practical AI development: live coding streams on Twitch,
    a blog with what we learn, and real products built in public.
  </p>
  <div class="pill-row">
    <span class="pill">Vibe Coding</span>
    <span class="pill">Agentic Programming</span>
    <span class="pill">Guardrails & Evals</span>
    <span class="pill">Real Products</span>
  </div>
</section>

<div class="section">
  <div class="card next-streams">
    <div class="card-head">
      <h2>Next streams</h2>
      <a href="{{ '/schedule/' | relative_url }}">Full schedule →</a>
    </div>
    {% include schedule-list.html limit=3 compact=true %}
    <div class="button-row">
      <a class="btn btn-primary" href="{{ site.twitch.url }}" target="_blank" rel="noopener">Follow on Twitch</a>
      <a class="btn" href="{{ '/schedule/' | relative_url }}">See the schedule</a>
    </div>
  </div>
</div>

<div class="section">
  <div class="card intro-card">
    <h2>Why follow We Vibing</h2>
    <div class="video-embed">
      <video controls playsinline preload="metadata" poster="{{ '/assets/video/intro-poster.jpg' | relative_url }}">
        <source src="{{ '/assets/video/intro.mp4' | relative_url }}" type="video/mp4" />
        <track kind="captions" srclang="en" label="English" src="{{ '/assets/video/intro.vtt' | relative_url }}" default />
      </video>
    </div>
  </div>
</div>

<div class="section" id="subscribe">
  <div class="card subscribe-card">
    <h2>Subscribe for notifications</h2>
    <p>Get an email when a stream is scheduled or goes live, and when new blog posts come out.</p>
    {% include subscribe-form.html %}
  </div>
</div>

<div class="section">
  <div class="card">
    <h2>Support We Vibing</h2>
    <p>Everything here is totally free. If you'd like to chip in, an optional Patreon pledge helps cover streaming gear and hosting.</p>
    <p><a class="pill" href="https://www.patreon.com/wevibing" target="_blank" rel="noopener">Chip in on Patreon</a></p>
  </div>
</div>
