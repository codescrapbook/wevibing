---
name: preview-coming-soon
description: Preview splash vs full We Vibing site locally without committing coming_soon.
---

# Preview splash vs full site

`coming_soon` in `_config.yml` is the launch switch. Leave the committed value alone unless the task is to launch.

**Splash (matches production today):**

```bash
bundle exec jekyll serve
```

Public pages show `_includes/coming-soon.html`. Exempt: signup result pages (`coming_soon_exempt: true`). Redirect stubs (`feed/`, `streams/`) and `/admin/` are not splashed. `_plugins/coming_soon.rb` deletes `_site/feed.xml` and `_site/sitemap.xml`.

**Full site, no config commit:**

```bash
printf 'coming_soon: false\n' > /tmp/coming_soon_off.yml
bundle exec jekyll serve --config _config.yml,/tmp/coming_soon_off.yml
```

Then `feed.xml` and `sitemap.xml` are generated. Check `/`, `/schedule/`, `/blog/`, `/about/`, `/projects/`, `/support/`, and a post URL.

**Launch (only if asked):** set `coming_soon: false` in `_config.yml`, build, merge to `main`. Do not POST test signups to Relay.
