# Cookie / storage / third-party inventory

Updated: 2026-11-20

Canonical Cookie Notice: https://whatdoyouwant.io/cookies  
Canonical Privacy Policy: https://whatdoyouwant.io/privacy  
Consent cookie: first-party `wdyw_consent` (JSON: `v`, `necessary`, `functional`, `performance`, `targeting`, `ts`), 12 months, `Path=/`, `SameSite=Lax`, `Secure`. Host-only except `Domain=.wevibing.com` on apex/www, and `Domain=.whatdoyouwant.io` if this code ever runs there.

Sources: site source plus headless Chromium on live `https://wevibing.com` / `https://www.wevibing.com` / `https://wevibing.com/check-your-inbox/` (2026-11-20). Production is still the coming-soon splash, so the Twitch player was not present on the live homepage. No first-party cookies, `localStorage`, or `sessionStorage` were set on those live loads **before** this consent work.

Local Chromium after this change: `wdyw_consent` is Path=/, Secure, SameSite=Lax, ~12 months; JSON `v=1` with category flags and `ts`. On `127.0.0.1` it is host-only (no `Domain=`), as specified for hosts other than `*.whatdoyouwant.io`. Twitch iframe injects only after Functional consent and is removed if that toggle is saved off.

Do not POST test signups to the live Relay endpoint. Relay cookies on `relay.whatdoyouwant.io` are therefore unverified.

## Inventory

| Name | Set by | Description | Purpose | Category | Lifespan |
| --- | --- | --- | --- | --- | --- |
| `wdyw_consent` | First-party, `wevibing.com` / `www.wevibing.com` | JSON of consent version, category flags, timestamp | Remember cookie choice; hide banner | Strictly Necessary | 12 months |
| Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js`) | Third-party, Cloudflare (edge-injected in production; not in repo HTML) | Cookieless visit counts | Site analytics | Performance (cookieless; **do not gate**) | n/a (no cookie) |
| Cloudflare Turnstile (`challenges.cloudflare.com/turnstile/v0/api.js` + widget frames) | Third-party, `challenges.cloudflare.com` | Bot protection on the Relay signup form | Verify humans before subscribe | Strictly Necessary (**do not gate**) | Session / Cloudflare-managed. No cookies were visible as first-party on 2026-11-20; Turnstile may set cookies on Cloudflare challenge hosts (e.g. `__cf_bm`, `cf_clearance`) depending on challenge state |
| Inter webfont | Third-party, `fonts.googleapis.com` / `fonts.gstatic.com` | Stylesheet + `woff2` | Site typography | Functional (cookieless; not gated — no cookies, system-ui fallback) | n/a (no cookie) |
| Twitch player iframe (`player.twitch.tv`) | Third-party, `twitch.tv` | Live stream embed on `/schedule/` | Watch the stream on-site | Functional (**gated** behind `wdyw_consent.functional`) | Twitch-controlled; typical player cookies include `unique_id`, `unique_id_durable`, and session IDs on `.twitch.tv`. **Not observed on live splash** (`coming_soon` hides the player). Localhost player errors are expected (`parent=` is production only) |
| Relay subscribe POST | Third-party form action, `relay.whatdoyouwant.io` | Email double opt-in | Send stream/post alerts the visitor asked for | Strictly Necessary for signup (no script embed) | Unverified (no test POST) |
| `assets/js/subscribe.js` | First-party | Progressive enhancement for the signup form | Inline status; sets hidden form fields only | Strictly Necessary | No cookie / storage |
| `assets/js/cookie-consent.js` | First-party | Banner, preferences panel, gated embeds | Consent UI | Strictly Necessary | Writes `wdyw_consent` only |
| First-party intro video (`/assets/video/intro.mp4`) | First-party | Homepage video | Content | Strictly Necessary | No cookie |
| Decap CMS (`/admin/`, `unpkg.com/decap-cms`) | Third-party, admin-only | Git-backed CMS | Editing content | n/a (not the public site; not gated by this banner) | GitHub / Decap session storage if an editor signs in |
| Patreon / Twitch outbound links | Navigation only | `patreon.com`, `twitch.tv` | Follow / support | n/a (no embed) | n/a |

## Gating

- **Always on:** Turnstile, Cloudflare Web Analytics, consent cookie, Relay form, first-party JS/CSS/video.
- **Functional:** Twitch player (`_includes/twitch-player.html`, `data-consent-embed="functional"`). Without JS or without functional consent, the fallback links to Twitch.
- **Performance toggle:** reserved; does not gate the Cloudflare analytics beacon.
- **Targeting toggle:** reserved; nothing loads for it today.

## Not present

- Google Analytics, ads, Meta/TikTok pixels, Cal.com, Stripe.js
- Site-specific privacy or cookie-notice pages (HTML redirects only: `/privacy/` → canonical policy, `/cookies/` → canonical notice)
- `localStorage` / `sessionStorage` keys on the public site
- Content-Security-Policy header (GitHub Pages). If one is added, keep allowing `static.cloudflareinsights.com` and `challenges.cloudflare.com`.
