---
layout: page
title: Blog
subtitle: "What we're learning about building software with AI."
permalink: /blog/
pagination:
  enabled: true
  per_page: 10
  collection: posts
  sort_field: "date"
  sort_reverse: true
---

<div class="section feed-articles">
  {% for post in paginator.posts %}
    <article class="card post">
      <header class="post-header">
        <p class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</p>
        <h2 class="post-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      </header>
      <div class="post-summary">
        <p>{{ post.excerpt | default: post.content | strip_html | truncatewords: 60 }}</p>
        <a href="{{ post.url | relative_url }}">Read more →</a>
      </div>
    </article>
  {% else %}
    <p class="muted">No posts yet. Check back soon.</p>
  {% endfor %}
</div>

{% if paginator.total_pages > 1 %}
  <nav class="section" aria-label="Pagination">
    <ul class="post-list pagination">
      {% if paginator.previous_page %}
        <li><a class="pill" href="{{ paginator.previous_page_path | relative_url }}">&larr; Newer</a></li>
      {% endif %}
      <li class="muted">Page {{ paginator.page }} of {{ paginator.total_pages }}</li>
      {% if paginator.next_page %}
        <li><a class="pill" href="{{ paginator.next_page_path | relative_url }}">Older &rarr;</a></li>
      {% endif %}
    </ul>
  </nav>
{% endif %}
