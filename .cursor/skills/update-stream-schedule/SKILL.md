---
name: update-stream-schedule
description: Update We Vibing Twitch slots in _data/schedule.yml (CT times, day vs date, example flag).
---

# Update the stream schedule

1. Edit `_data/schedule.yml` (or Decap → Stream schedule). Rendered on `/schedule/` and homepage “Next streams” (`limit=3`).
2. Each slot needs `title`, `start` (`HH:MM` 24h, America/Chicago / CT), and **either** `day` (weekly) **or** `date` (`YYYY-MM-DD`). Optional: `duration_minutes`, `description`.
3. For a live slot, omit `example` or set it `false`. `example: true` shows an Example tag.
4. One-offs with `date` before the build date disappear automatically. Recurring `day` slots always list first.
5. Do not put the Twitch channel in this file; it comes from `_config.yml` `twitch.*`.
6. Verify: `bundle exec jekyll build --config _config.yml -d _site`. Local Twitch player errors are expected (`parent=` is production only).
7. Update `docs/agent/status.md` (note whether examples remain).
