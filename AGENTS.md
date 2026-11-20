# AGENTS.md

Read [docs/agent/status.md](docs/agent/status.md) before changing anything. After meaningful work, update `status.md` and append to [docs/agent/decisions.md](docs/agent/decisions.md) if you made a lasting choice. Interrupted work: copy [docs/agent/handoff.md](docs/agent/handoff.md). Humans: [README.md](README.md). Cursor: `.cursor/rules/`, `.cursor/skills/`.

## Product

We Vibing ([wevibing.com](https://wevibing.com)) is a free Jekyll site: AI-coding live streams on Twitch, a blog, and email alerts. Company: What Do You Want? LLC. Author: Joe Seeley. Twitch channel: `seeleyvibing`. Patreon is optional donations only. `coming_soon: true` currently replaces public pages with a splash + signup; signup result pages stay visible.

## Stack

- Ruby `>= 3.0` (CI `3.2`; verified `3.2.3`)
- Jekyll `~> 4.3` (lockfile `4.4.1`), Bundler (lockfile generated with `4.0.21`)
- Plugins: `jekyll-seo-tag` `~> 2.8`, `jekyll-sitemap` `~> 1.4`, `jekyll-feed` `~> 0.17`, `jekyll-include-cache` `~> 0.2`, `jekyll-paginate-v2` `~> 3.0`
- Decap CMS 3 at `/admin/` (`admin/config.yml`, `local_backend: true`)
- Email: Relay via `subscribe.endpoint`; Cloudflare Turnstile via `subscribe.turnstile_sitekey`
- Hosting: GitHub Pages (Actions) on `wevibing.com`, `baseurl: ""`
- No Node app, no test suite, no linter, no typecheck

## Repo map

| Path | Role |
| --- | --- |
| `_config.yml` | title, `coming_soon`, nav, subscribe, twitch, patreon, `legal`, permalinks, `exclude` |
| `_layouts/default.html` | chrome + splash swap (`coming_soon_exempt`) + cookie banner |
| `_layouts/page.html`, `post.html` | page/post wrappers |
| `_includes/` | `header`, `footer`, `coming-soon`, `subscribe-form`, `schedule-list`, `schedule-item`, `cookie-consent`, `twitch-player` |
| `_plugins/coming_soon.rb` | deletes `feed.xml` + `sitemap.xml` when splash is on (not HTML) |
| `_posts/*.md` | blog; URL is `/blog/<filename-slug>/` from `permalink: /blog/:title/` |
| `_data/schedule.yml` | Twitch slots (America/Chicago, shown as CT) |
| `assets/css/main.scss` | all CSS; `$bp-md: 960px` must match JS `DESKTOP_BP` |
| `assets/js/subscribe.js` | progressive enhancement for the Relay form |
| `assets/js/cookie-consent.js` | `wdyw_consent` cookie, banner, preferences, gated embeds |
| `privacy/index.html` → canonical Privacy Policy; `cookies/index.html` → canonical Cookie Notice | `layout: null` (still live during splash) |
| `docs/agent/cookies.md` | cookie / storage / third-party inventory |
| `index.md` `/` · `schedule.md` `/schedule/` · `blog.md` `/blog/` | blog lists 10 posts per page |
| `about.md` `projects.md` `support.md` | `/support/` is footer-only, not in nav |
| `check-your-inbox.md` `subscribed.md` `unsubscribed.md` `subscribe-error.md` | `noindex`, `coming_soon_exempt`, `sitemap: false` |
| `feed/index.html` → `/blog/`; `streams/index.html` → `/schedule/` | `layout: null` (still live during splash) |
| `admin/` | Decap UI + GitHub backend |
| `.github/workflows/jekyll-gh-pages.yml` | build + Pages deploy |
| `docs/agent/` | agent memory; excluded from the published site |

## Commands

Verified this run (Ruby 3.2.3; `bundle install` pulled Bundler 4.0.21):

```bash
bundle config set path 'vendor/bundle'   # optional; CI does this
bundle install
bundle exec jekyll serve                 # http://localhost:4000/
bundle exec jekyll build --config _config.yml -d _site
```

Preview the full site without committing a flag change:

```bash
printf 'coming_soon: false\n' > /tmp/coming_soon_off.yml
bundle exec jekyll serve --config _config.yml,/tmp/coming_soon_off.yml
```

| Task | Command |
| --- | --- |
| Lint / typecheck / test | none — no RSpec, ESLint, or `package.json` |
| Deploy | merge to `main` (Actions → GitHub Pages). PRs do **not** run the workflow |
| Decap local | `npx decap-server` then `bundle exec jekyll serve` — **unverified** this run |

CI: `ruby/setup-ruby@v1`, `ruby-version: '3.2'`, `bundler-cache: true`, then the build command above.

## Conventions

- Keep `baseurl` empty. A `/wevibing` prefix 404s CSS and links on the custom domain.
- Use `relative_url` / `absolute_url`. Site `timezone` is UTC; stream times are CT.
- Nav comes from `_config.yml` `navigation`. Header CTAs: Twitch + Patreon.
- Posts: `_posts/YYYY-MM-DD-slug.md` with `title` and optional `excerpt`. Default layout `post`.
- Schedule slot: weekly `day` **or** one-off `date` (not both). `start` is 24h `HH:MM` CT. Remove `example: true` when the slot is real. Past one-offs drop off on the next build.
- Relay form contract: `email`, `list[]` (`stream-alerts`, `new-post-notifications`), `consent=true`, `_gotcha`, `form_started_at`, `source_url`, `cf-turnstile-response`. One POST with every checked list. Details: README.
- Splash HTML is swapped in `_layouts/default.html`. Exempt pages set `coming_soon_exempt: true`.
- Cookie banner + preferences: first-party `wdyw_consent`. Canonical Privacy Policy / Cookie Notice are `site.legal.*` on whatdoyouwant.io; do not host copies here. Gate the Twitch player (`data-consent-embed="functional"`). Never gate Turnstile or Cloudflare Web Analytics.
- Company string: `What Do You Want? LLC`. No swearing.

## Config keys (never values)

No runtime env vars for the site. Public keys in `_config.yml`: `subscribe.endpoint`, `subscribe.turnstile_sitekey`, `twitch.channel` / `twitch.url` / `twitch.schedule_url`, `patreon.url`, `legal.privacy_url`, `legal.cookies_url`. Gitignored: `.env`. A Decap GitHub OAuth proxy (not in this repo) would use `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

## CI

`.github/workflows/jekyll-gh-pages.yml` runs on `push` to `main` and `workflow_dispatch` only. Deploy job: `if: github.ref == 'refs/heads/main'`, environment `github-pages`, CNAME `wevibing.com`. Latest `main` run succeeded (2026-11-18). First Pages deploy may need environment approval. Always `jekyll build` locally before merging.

## Do not

- Do not set `baseurl` or restore `_config.pages.yml` with `/wevibing`.
- Do not POST test signups to the live Relay endpoint.
- Do not commit secrets, OAuth client secrets, or private Relay keys.
- Do not flip `coming_soon: false` unless the task is to launch.
- Do not add paid offers, workshops, book club, or a `streams` collection (removed in PR #6).
- Do not change Twitch embed `parent=` away from `wevibing.com` / `www.wevibing.com` (localhost player errors are expected).
- Do not hardcode the Twitch channel; use `site.twitch.*`. Username `wevibing` is taken.
- Do not publish `docs/` or `AGENTS.md` (keep them in `_config.yml` `exclude`).
- Do not host a site-specific Privacy Policy or Cookie Notice; link to `https://whatdoyouwant.io/privacy` and `https://whatdoyouwant.io/cookies`.
- Do not add `CLAUDE.md`; this file is the agent entrypoint.
