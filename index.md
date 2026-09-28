---
layout: page
title: We Vibing
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
  <div class="grid">
    <div class="card" style="grid-column: span 7;">
      <h2>Latest on the blog</h2>
      <ul class="post-list">
        {% assign latest_posts = site.posts | slice: 0, 5 %}
        {% for post in latest_posts %}
          <li>
            <a href="{{ post.url | relative_url }}"><strong>{{ post.title }}</strong></a>
            <div class="muted">{{ post.date | date: "%b %-d, %Y" }}</div>
          </li>
        {% endfor %}
      </ul>
      <p><a href="{{ '/blog/' | relative_url }}">View all posts →</a></p>
    </div>
    <div class="card" style="grid-column: span 5;">
      <h2>Upcoming & recent streams</h2>
      <ul class="stream-list">
        {% assign latest_streams = site.streams | sort: 'stream_date' | reverse | slice: 0, 4 %}
        {% for stream in latest_streams %}
          <li>
            <a href="{{ stream.url | relative_url }}"><strong>{{ stream.title }}</strong></a>
            {% if stream.stream_date %}<div class="muted">{{ stream.stream_date | date: "%b %-d, %Y" }}</div>{% endif %}
          </li>
        {% endfor %}
      </ul>
      <p><a href="{{ '/streams/' | relative_url }}">View streams →</a></p>
    </div>
  </div>
</div>

<div class="section">
  <div class="grid">
    <div class="card" style="grid-column: span 12;">
      <h2>Support We Vibing</h2>
      <p>Enjoy the content? Keep it going with a small monthly pledge. You’ll help fund streams, posts, and experiments.</p>
      <p><a class="pill" href="https://www.patreon.com/wevibing" target="_blank" rel="noopener">Become a Patron</a></p>
    </div>
  </div>
</div>

