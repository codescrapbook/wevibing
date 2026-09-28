# We Vibing — Jekyll + Decap CMS

A modern, clean Jekyll site for We Vibing (wevibing.com): learn to code with AI — start with vibe coding, grow into agentic programming, guardrails, and workflows. Includes Decap CMS (formerly Netlify CMS) for browser-based editing.

## Quickstart (local)

Prereqs:
- Ruby (3.x recommended) and Bundler

Install dependencies:

```bash
bundle config set path 'vendor/bundle'
bundle install
```

Run the site locally (uncommon port to avoid conflicts):

```bash
bundle exec jekyll serve --port 43123 --livereload
```

Open:
- Site: http://127.0.0.1:43123
- CMS (local backend): http://127.0.0.1:43123/admin/

Decap is configured with `local_backend: true`, so you can create and edit content locally immediately.

## Content model

- Blog Posts: `_posts/` (markdown). Front matter: `title`, `date`, `description`, `tags`, `hero` (optional), `draft` (optional).
- Streams / Videos: `_streams/` (markdown). Front matter: `title`, `date`, `description`, `tags`, `youtube_id` or `video_url` (one optional), `draft` (optional).
- Pages: simple markdown pages editable via CMS (`about.md`, `projects.md`, `book-club.md`, `support.md`).

Navigation is defined in `_config.yml` under `nav`.

## Decap CMS (production)

This repo includes `/admin/` with Decap CMS. Choose one of two auth backends when you deploy:

1) Netlify Identity + Git Gateway (recommended if using Netlify)
- In Netlify dashboard: enable Identity, then enable Git Gateway.
- Deploy the site, then visit `/admin/` and log in with your Netlify Identity user.
- No code changes needed; the default backend is:
  ```yml
  backend:
    name: git-gateway
    branch: main
  ```

2) GitHub backend (for GitHub OAuth App-based auth)
- Edit `admin/config.yml` and uncomment/update:
  ```yml
  backend:
    name: github
    repo: your-github-username/your-repo-name
    branch: main
  ```
- Set up Decap GitHub auth per Decap docs (OAuth app or proxy). Then use `/admin/`.

Media uploads go to `assets/uploads/` and are referenced at `/assets/uploads/...`.

## Deployment

Option A: Netlify
- Connect this repo in Netlify.
- Build command: `bundle exec jekyll build`
- Publish directory: `_site`
- Enable Netlify Identity + Git Gateway if you want CMS editing in production.

Option B: GitHub Pages
- Either use GitHub Actions to run `jekyll build` and publish `_site` to `gh-pages`,
  or use the `github-pages` gem in the build environment (not included by default here).
- For a custom domain (`wevibing.com`), add a `CNAME` file with the domain and configure DNS.

## SEO & basics

- Canonical URL: `_config.yml` sets `url: https://wevibing.com`
- Open Graph tags: via `jekyll-seo-tag`. Set `logo` and `image` paths in `_config.yml`.
- Sitemap: `jekyll-sitemap` auto-generates `/sitemap.xml`
- Robots: see `robots.txt`
- RSS: `jekyll-feed` at `/feed.xml`

## Branding and links

- Patreon: footer/header buttons use `https://www.patreon.com/wevibing` (change anytime).
- Projects (footer and `/projects/`): update placeholder links for Uprightly and VitalPerks.
- Logo: `assets/images/logo.svg` (replace with your own when ready).

## Development notes

- Styles live in `assets/css/main.scss` (processed by Jekyll). It’s a clean, responsive, dev-education vibe with good typography and a subtle dark-leaning palette.
- Layouts (`_layouts/`) and includes (`_includes/`) are custom — not a stock theme.
- Collections for `streams` (and optional `bookclub`) are defined in `_config.yml`.

## License and security

- No secrets are committed. Auth backends are placeholders; configure them per your host.
- Keep OAuth keys and tokens out of the repo.

## Scripts

Common commands:
```bash
bundle exec jekyll build      # Build to _site
bundle exec jekyll serve -H 0.0.0.0 -P 43123 --livereload
```

---

We Vibing — code with AI, from vibes to agents. If this helps, consider supporting on Patreon: https://www.patreon.com/wevibing
