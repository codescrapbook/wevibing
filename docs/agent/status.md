# Status

Updated: 2026-11-20

## Current

- Production splash is on: `coming_soon: true` in `_config.yml`. Signup result pages are exempt.
- Latest `main`: `55270d3` (PR #7, Twitch channel `seeleyvibing`). Pages workflow `build` + `deploy` succeeded 2026-11-18.
- Site is free: Twitch schedule, blog, Relay signup. Patreon is optional donations only.
- Schedule slots in `_data/schedule.yml` are still `example: true` (Tue/Thu 19:00 CT + one-off 2026-12-05).
- Decap at `/admin/` uses GitHub backend; production `backend.base_url` (OAuth proxy) is unset.
- No test suite, linter, or typecheck. Workflow runs only on `main` (not on PRs).
- Open PRs at last check: none besides this agent-docs change.

## In flight

- Agent-onboarding docs: `AGENTS.md`, `.cursor/rules`, `.cursor/skills`, `docs/agent/*`, `.cursorignore`, `_config.yml` `exclude`.

## Known issues / gotchas

- Twitch embed fails on localhost because `parent=` is `wevibing.com` / `www.wevibing.com` only. Expected.
- With splash off, homepage title is “We Vibing — We Vibing” (`page.title` equals `site.title`).
- PR #6 noted Relay confirmation emails may be limited until SES production access; **unverified** since 2026-11-13.

## Next

- Replace example schedule slots; drop `example: true`.
- Launch: `coming_soon: false` on `main` when ready.
- Optional: Decap GitHub OAuth proxy (`admin/config.yml` `backend.base_url`).
