# Decisions

Short log of choices that still constrain the repo. Newest first.

## 2026-11-20 — Canonical privacy/cookies; first-party consent banner

- Status: accepted
- Context: Every What Do You Want? LLC site uses the same Privacy Policy and Cookie Notice on whatdoyouwant.io. This repo must not host copies.
- Decision: Footer + splash link to `https://whatdoyouwant.io/privacy` and `https://whatdoyouwant.io/cookies`. Cookie banner + preferences store `wdyw_consent` first-party. Twitch player is Functional and gated. Turnstile and Cloudflare Web Analytics stay ungated. `/privacy/` and `/cookies/` are redirects, not local legal text.
- Inventory: `docs/agent/cookies.md`

## 2026-11-18 — Twitch channel is `seeleyvibing`

- Status: accepted
- Context: Twitch username `wevibing` is taken.
- Decision: `_config.yml` `twitch.channel` / URLs point at `seeleyvibing`. Embed `parent=` stays the **site** domain (`wevibing.com`, `www.wevibing.com`), not the channel name.
- PR: [#7](https://github.com/codescrapbook/wevibing/pull/7)

## 2026-11-17 — Free site: schedule + blog + Relay

- Status: accepted
- Context: Paid workshop/book-club offers did not match the product.
- Decision: No paid offers. Nav is Home / Schedule / Blog / Projects / About. `/blog/` is paginated posts; `/schedule/` is Twitch player + `_data/schedule.yml`. `/feed/` and `/streams/` redirect. Email is Relay (`subscribe.endpoint`) with Turnstile; one POST of `list[]`. Local subscribe server removed. Patreon is optional donations (`/support/` footer-only).
- PR: [#6](https://github.com/codescrapbook/wevibing/pull/6)

## 2026-11-03 — Signup result pages stay visible during splash

- Status: accepted
- Context: Relay redirects need real pages while `coming_soon` is on.
- Decision: `/check-your-inbox/`, `/subscribed/`, `/unsubscribed/`, `/subscribe-error/` set `coming_soon_exempt`, `noindex`, `sitemap: false`. Splash swap lives in `_layouts/default.html`; the plugin only deletes feed/sitemap.
- PR: [#5](https://github.com/codescrapbook/wevibing/pull/5)

## 2026-10-16 — Empty `baseurl` for the custom domain

- Status: accepted
- Context: Building with `baseurl: /wevibing` (old `_config.pages.yml`) 404’d CSS and links on wevibing.com. `codescrapbook.github.io/wevibing/` redirects to the apex and drops that path.
- Decision: Single `_config.yml`, `baseurl: ""`. CI builds with `_config.yml` only.

## 2026-10-16 — Coming-soon splash until launch

- Status: accepted (still on)
- Decision: `coming_soon: true` replaces public HTML with the splash. Content stays in the repo. Flip to `false` on `main` to publish.

## 2026-09-28 — Custom Jekyll + Actions Pages

- Status: accepted
- Decision: No stock theme. Deploy via `.github/workflows/jekyll-gh-pages.yml` (not the default Pages Jekyll action). Decap at `/admin/`. Canonical URL `https://wevibing.com`.
- PR: [#1](https://github.com/codescrapbook/wevibing/pull/1)

## 2026-09-28 — Responsive nav at 960px

- Status: accepted
- Decision: Mobile-first SCSS; `$bp-md: 960px` matches header JS `DESKTOP_BP`. Menu collapses only when JS runs.
- PR: [#3](https://github.com/codescrapbook/wevibing/pull/3)

## Superseded

- PR [#2](https://github.com/codescrapbook/wevibing/pull/2) combined Blog + Streams into `/feed/`. PR #6 split them; keep the redirects, do not restore the combined feed or `streams` collection.
