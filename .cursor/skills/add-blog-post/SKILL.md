---
name: add-blog-post
description: Add a We Vibing blog post with the correct filename, front matter, and /blog/ permalink.
---

# Add a blog post

1. Create `_posts/YYYY-MM-DD-slug.md`. The URL will be `/blog/<slug>/` because `_config.yml` sets `permalink: /blog/:title/` (filename slug, not the display title).
2. Front matter:

```yaml
---
title: "Clear title"
excerpt: "One or two sentences for the /blog/ card."
---
```

Layout defaults to `post`. Date comes from the filename (and optional `date:`).
3. Body is Markdown. `/blog/` lists posts, 10 per page (`blog.md` pagination).
4. Do not add tags/categories unless asked; the theme does not render them.
5. Verify: `bundle exec jekyll build --config _config.yml -d _site` and open `_site/blog/<slug>/index.html`. With `coming_soon: true` the built page still shows the splash — preview with a `coming_soon: false` overlay config (see AGENTS.md) to inspect the post.
6. Update `docs/agent/status.md` if this was the task.
