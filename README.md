# We Vibing — Jekyll site

This repository hosts the We Vibing site: free AI coding live streams on Twitch, a blog, and email notifications.

## Local development

Prereqs:
- Ruby (3.0+ recommended)
- Bundler (`gem install bundler`)
 
Plugins:
- Pagination uses `jekyll-paginate-v2` (installed via Gemfile)

Clone and run:

```bash
git clone https://github.com/codescrapbook/wevibing
cd wevibing
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000/`. The custom domain serves the site at the root, so local and production both use an empty `baseurl`.

## Email notifications (Relay)

The signup form (`_includes/subscribe-form.html`, used on the homepage, `/schedule/`, and the coming-soon splash) posts to Relay at the `subscribe.endpoint` in `_config.yml`. Relay handles double opt-in, confirmation emails, and unsubscribes.

- Fields: `email`, `list[]` checkboxes (`stream-alerts`, `new-post-notifications`), `consent=true`, `_gotcha` honeypot, `form_started_at`, `source_url`, and the Cloudflare Turnstile token (`cf-turnstile-response`).
- Without JS the form posts directly and Relay 303-redirects to `/check-your-inbox/` or `/subscribe-error/`.
- Both lists go in one request (`list[]`), with or without JS, and Relay sends one confirmation email covering all chosen lists. With JS, `assets/js/subscribe.js` posts the same fields as a single FormData request (`Accept: application/json`) and shows the result inline.
- `subscribe.turnstile_sitekey` is currently Cloudflare's test key; swap in the real site key before launch.
- Result pages: `/check-your-inbox/`, `/subscribed/`, `/unsubscribed/`, `/subscribe-error/` (noindex, out of nav and sitemap, shown even while the splash is on).
- Please don't submit test signups against the live Relay endpoint.

## Content model

- Posts: `_posts/*.md` (standard Jekyll posts), listed and paginated at `/blog/` (10 per page)
- Stream schedule: `_data/schedule.yml`, rendered on `/schedule/` (with the Twitch player) and as "Next streams" on the homepage. Times are America/Chicago (CT). Each slot has either a weekly `day` or a one-off `date`; past one-offs drop off on the next build.
- Pages: root-level `*.md` (`/about/`, `/projects/`, `/support/`). `/support/` is optional Patreon donations, linked from the footer.
- `/feed/` and `/streams/` are old URLs that redirect to `/blog/` and `/schedule/`.

## Coming soon

`coming_soon: true` in `_config.yml` replaces every public page with the launch splash (logo and email signup). Posts, the schedule, and the rest of the site stay in the repo. Set it to `false` and push to `main` to publish them again. Pages with `coming_soon_exempt: true` (the signup result pages) still render normally. While the flag is on, `feed.xml` and `sitemap.xml` are left out of the build.

## SEO

Configured with `jekyll-seo-tag`, `jekyll-sitemap`, and `jekyll-feed`. Canonical URL is `https://wevibing.com`.

## GitHub Actions + Pages

Workflow: `.github/workflows/jekyll-gh-pages.yml`
- On push to `main` and `workflow_dispatch`
- Builds with `_config.yml` only, so `baseurl` stays empty. `https://wevibing.com` serves files at the domain root; a `/wevibing` prefix makes CSS, images, and links 404 there. `https://codescrapbook.github.io/wevibing/` redirects to the custom domain and drops that path.
- Uploads artifact and deploys via GitHub Pages
- Sets CNAME to `wevibing.com` in deploy step

Required repo setting:
- Settings → Pages → Build and deployment → Source: GitHub Actions
- The first run may require approving the `github-pages` environment

The `*.github.io` project URL redirects to the custom domain:
- https://wevibing.com/

## Custom domain (wevibing.com)

- Add a `CNAME` DNS record for `wevibing.com` pointing to `codescrapbook.github.io.`
- Optionally add `A/AAAA` records per GitHub Pages docs if apex binding is preferred
- In GitHub, under Settings → Pages, ensure the custom domain is set to `wevibing.com` and enforce HTTPS after the certificate is provisioned

## Decap CMS (at `/admin/`)

Local:
- `admin/config.yml` has `local_backend: true` so you can run `npx decap-server` or `npx decap-cms-proxy-server` for local auth, then `bundle exec jekyll serve`

Production:
- The backend is configured for GitHub:
  ```yaml
  backend:
    name: github
    repo: codescrapbook/wevibing
    branch: main
  ```
- To enable GitHub OAuth for Decap on GitHub Pages, set up a small OAuth proxy (for example `decap-oauth-provider` on Render/Netlify) and add its URL to `backend.base_url`. Steps:
  1. Create a GitHub OAuth App with callback `https://YOUR-OAUTH-APP/authorize` (per Decap docs).
  2. Deploy `decap-github-oauth-provider` and configure `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`.
  3. Set `base_url` in `admin/config.yml` to your proxy URL.
  4. Commit changes; `/admin/` will sign in with GitHub.

Placeholders:
- Patreon CTA uses `https://www.patreon.com/wevibing`
- Patreon is optional donations only; everything on the site is free
- Projects mention Uprightly and VitalPerks lightly

## Contributing

Open a PR on this repo. On merge to `main`, the Pages workflow will build and deploy.

