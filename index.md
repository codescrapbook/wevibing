---
layout: page
title: We Vibing
hide_title: true
permalink: /
---

<section class="hero">
  <h1>Code with AI. Start with vibe coding, then build agents with guardrails.</h1>
  <p>
    We Vibing teaches practical AI development: from quick vibes and prompts to
    robust agentic systems, evals, and safety. Follow along with posts, join live streams,
    and read with our AI book club.
  </p>
  <div class="pill-row">
    <span class="pill">Vibe Coding</span>
    <span class="pill">Agentic Programming</span>
    <span class="pill">Guardrails & Evals</span>
    <span class="pill">Real Products</span>
  </div>
</section>

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
    <p>Get an email for upcoming book clubs, streams when they go live, and new blog posts.</p>
    <form class="subscribe-form" data-subscribe data-endpoint="{{ site.subscribe.endpoint }}" novalidate>
      <label class="sr-only" for="subscribe-email">Email</label>
      <input id="subscribe-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com" />
      <button type="submit">Subscribe</button>
    </form>
    <p class="subscribe-note">Email double opt-in. We send one confirmation message, and you are subscribed only after you open that link.</p>
    <p class="subscribe-status" id="subscribe-status" role="status"></p>
  </div>
</div>

<script src="{{ '/assets/js/subscribe.js' | relative_url }}" defer></script>

<div class="section">
  <div class="grid">
    <div class="card md-col-12">
      <h2>Support We Vibing</h2>
      <p>Enjoy the content? Keep it going with a small monthly pledge. You’ll help fund streams, posts, and experiments.</p>
      <p><a class="pill" href="https://www.patreon.com/wevibing" target="_blank" rel="noopener">Become a Patron</a></p>
    </div>
  </div>
</div>

