---
layout: page
title: Streams
permalink: /streams/
---

<ul class="stream-list">
  {% assign streams_sorted = site.streams | sort: 'stream_date' | reverse %}
  {% for stream in streams_sorted %}
    <li>
      <a href="{{ stream.url | relative_url }}"><strong>{{ stream.title }}</strong></a>
      {% if stream.stream_date %}<div class="muted">{{ stream.stream_date | date: "%b %-d, %Y" }}</div>{% endif %}
    </li>
  {% endfor %}
</ul>

