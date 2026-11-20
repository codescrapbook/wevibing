# Status

Updated: 2026-11-20

## Current

- Production splash is on: `coming_soon: true` in `_config.yml`. Signup result pages are exempt.
- Latest `main`: `a53dd2d` (PR #8, agent onboarding docs). Pages workflow last succeeded 2026-11-18.
- Site is free: Twitch schedule, blog, Relay signup. Patreon is optional donations only.
- Schedule slots in `_data/schedule.yml` are still `example: true` (Tue/Thu 19:00 CT + one-off 2026-12-05).
- Decap at `/admin/` uses GitHub backend; production `backend.base_url` (OAuth proxy) is unset.
- No test suite, linter, or typecheck. Workflow runs only on `main` (not on PRs).
- Cookie banner + preferences (`wdyw_consent`); canonical legal URLs on whatdoyouwant.io. Inventory: `docs/agent/cookies.md`.

## In flight

- Cookie notice / privacy links / consent banner: [#9](https://github.com/codescrapbook/wevibing/pull/9).

## Known issues / gotchas

- Twitch embed fails on localhost because `parent=` is `wevibing.com` / `www.wevibing.com` only. Expected. The player is also gated on Functional consent.
- With splash off, homepage title is “We Vibing — We Vibing” (`page.title` equals `site.title`).
- PR #6 noted Relay confirmation emails may be limited until SES production access; **unverified** since 2026-11-13.
- Cloudflare Web Analytics is edge-injected in production (`static.cloudflareinsights.com`); it is not in repo HTML and must not be gated.

## Next

- Replace example schedule slots; drop `example: true`.
- Launch: `coming_soon: false` on `main` when ready.
- Optional: Decap GitHub OAuth proxy (`admin/config.yml` `backend.base_url`).
