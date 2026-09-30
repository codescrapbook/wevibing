# We Vibing — Jekyll site

This repository hosts the We Vibing site and blog.

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
bundle exec jekyll serve --config _config.yml,_config.pages.yml
```

Open `http://localhost:4000/wevibing/` when serving with `_config.pages.yml`.

Notifications use email double opt-in. Start the subscribe API in a second terminal:

```bash
SUBSCRIBE_DEV_MAILBOX=1 bundle exec ruby script/subscribe_server.rb
```

The homepage form posts to the `subscribe.endpoint` in `_config.yml` (`http://127.0.0.1:4001` by default). An address is stored as subscribed only after the confirmation link is opened. Without `SMTP_ADDRESS`, messages are written to `tmp/subscribe/mail` and listed at `http://127.0.0.1:4001/dev/mailbox`. To send real mail, set `SMTP_ADDRESS`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `MAIL_FROM`, and leave `SUBSCRIBE_DEV_MAILBOX` unset. Set `subscribe.endpoint` to the public API URL before deploying.

## Content model

- Posts: `_posts/*.md` (standard Jekyll posts)
- Streams: `_streams/*.md` (custom collection)
- Pages: root-level `*.md` (`/about`, `/projects`, `/book-club`, `/support`)
 
## Combined Feed

- The site now has a single combined feed at `/feed/` that lists both Posts and Streams together, newest first, with 10 items per page.
- Stream items are embedded inline on the feed page (YouTube embeds are responsive).
- Individual post and stream permalinks remain unchanged for SEO and sharing.
- Old listing pages (`/blog/` and `/streams/`) now point readers to the combined feed.

## SEO

Configured with `jekyll-seo-tag`, `jekyll-sitemap`, and `jekyll-feed`. Canonical URL is `https://wevibing.com`.

## GitHub Actions + Pages

Workflow: `.github/workflows/jekyll-gh-pages.yml`
- On push to `main` and `workflow_dispatch`
- Builds with `_config.yml,_config.pages.yml` (so preview at `https://codescrapbook.github.io/wevibing/` works)
- Uploads artifact and deploys via GitHub Pages
- Sets CNAME to `wevibing.com` in deploy step

Required repo setting:
- Settings → Pages → Build and deployment → Source: GitHub Actions
- The first run may require approving the `github-pages` environment

Expected Pages preview URL (until custom domain is live):
- https://codescrapbook.github.io/wevibing/

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
- Projects mention Uprightly and VitalPerks lightly

## Contributing

Open a PR on this repo. On merge to `main`, the Pages workflow will build and deploy.

