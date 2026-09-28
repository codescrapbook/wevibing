# We Vibing — Jekyll site

This repository hosts the We Vibing site and blog.

## Local development

Prereqs:
- Ruby (3.0+ recommended)
- Bundler (`gem install bundler`)

Clone and run:

```bash
git clone https://github.com/codescrapbook/wevibing
cd wevibing
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.

## Content model

- Posts: `_posts/*.md` (standard Jekyll posts)
- Streams: `_streams/*.md` (custom collection)
- Pages: root-level `*.md` (`/about`, `/projects`, `/book-club`, `/support`)

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

