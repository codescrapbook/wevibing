---
layout: page
title: Blog
permalink: /blog/
---

<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}"><strong>{{ post.title }}</strong></a>
      <div class="muted">{{ post.date | date: "%b %-d, %Y" }}</div>
    </li>
  {% endfor %}
</ul>

