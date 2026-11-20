// First-party cookie consent for We Vibing.
// Stores `wdyw_consent` (version, categories, timestamp), 12 months, SameSite=Lax, Secure.
// Gates [data-consent-embed] frames. Never gates Turnstile or Cloudflare Web Analytics.
(function () {
  var COOKIE_NAME = "wdyw_consent";
  var VERSION = 1;
  var MAX_AGE = 60 * 60 * 24 * 365;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  var banner = document.getElementById("cookie-banner");
  var prefs = document.getElementById("cookie-prefs");
  var panel = prefs && prefs.querySelector(".cookie-prefs-panel");
  var lastFocus = null;

  function defaultConsent(extra) {
    var consent = {
      v: VERSION,
      necessary: true,
      functional: false,
      performance: false,
      targeting: false,
      ts: Date.now()
    };
    if (extra) {
      Object.keys(extra).forEach(function (key) {
        consent[key] = extra[key];
      });
    }
    return consent;
  }

  function domainAttribute() {
    var host = location.hostname;
    if (host === "whatdoyouwant.io" || host.endsWith(".whatdoyouwant.io")) {
      return "; Domain=.whatdoyouwant.io";
    }
    if (host === "wevibing.com" || host === "www.wevibing.com") {
      return "; Domain=.wevibing.com";
    }
    return "";
  }

  function readConsent() {
    var parts = document.cookie.split("; ");
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(COOKIE_NAME + "=") === 0) {
        try {
          var data = JSON.parse(decodeURIComponent(parts[i].slice(COOKIE_NAME.length + 1)));
          if (data && data.v === VERSION) {
            data.necessary = true;
            return data;
          }
        } catch (e) {}
        return null;
      }
    }
    return null;
  }

  function writeConsent(consent) {
    consent.necessary = true;
    consent.v = VERSION;
    consent.ts = Date.now();
    document.cookie =
      COOKIE_NAME +
      "=" +
      encodeURIComponent(JSON.stringify(consent)) +
      "; Path=/; Max-Age=" +
      MAX_AGE +
      "; SameSite=Lax; Secure" +
      domainAttribute();
    return consent;
  }

  function applyEmbeds(consent) {
    document.querySelectorAll("[data-consent-embed]").forEach(function (el) {
      var category = el.getAttribute("data-consent-embed") || "functional";
      var allowed = Boolean(consent && consent[category]);
      var iframe = el.querySelector("iframe");
      var fallback = el.querySelector(".consent-fallback");
      if (allowed) {
        if (!iframe) {
          iframe = document.createElement("iframe");
          iframe.src = el.getAttribute("data-src") || "";
          iframe.title = el.getAttribute("data-title") || "";
          iframe.setAttribute("allowfullscreen", "");
          iframe.setAttribute("loading", "lazy");
          iframe.setAttribute("frameborder", "0");
          el.appendChild(iframe);
        }
        if (fallback) fallback.hidden = true;
      } else {
        if (iframe) iframe.remove();
        if (fallback) fallback.hidden = false;
      }
    });
  }

  function syncBannerOffset() {
    var height = banner && !banner.hidden ? banner.offsetHeight : 0;
    document.documentElement.style.setProperty("--cookie-banner-offset", height + "px");
    document.documentElement.classList.toggle("cookie-banner-visible", height > 0);
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
    syncBannerOffset();
  }

  function showBanner() {
    if (banner) banner.hidden = false;
    syncBannerOffset();
  }

  function syncToggles(consent) {
    if (!prefs) return;
    var source = consent || defaultConsent();
    prefs.querySelectorAll("[data-cookie-cat]").forEach(function (input) {
      var cat = input.getAttribute("data-cookie-cat");
      if (cat === "necessary") {
        input.checked = true;
        return;
      }
      input.checked = Boolean(source[cat]);
    });
  }

  function readToggles() {
    var extra = {};
    if (!prefs) return defaultConsent();
    prefs.querySelectorAll("[data-cookie-cat]").forEach(function (input) {
      var cat = input.getAttribute("data-cookie-cat");
      if (cat === "necessary") return;
      extra[cat] = input.checked;
    });
    return defaultConsent(extra);
  }

  function focusables() {
    if (!panel) return [];
    return Array.prototype.slice.call(panel.querySelectorAll(FOCUSABLE)).filter(function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
  }

  function closePrefs() {
    if (!prefs || prefs.hidden) return;
    prefs.hidden = true;
    document.documentElement.classList.remove("cookie-prefs-open");
    document.removeEventListener("keydown", onPrefsKeydown, true);
    if (lastFocus && typeof lastFocus.focus === "function") {
      try { lastFocus.focus(); } catch (e) {}
    }
    lastFocus = null;
  }

  function onPrefsKeydown(event) {
    if (prefs.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closePrefs();
      return;
    }
    if (event.key !== "Tab") return;
    var nodes = focusables();
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openPrefs() {
    if (!prefs) return;
    lastFocus = document.activeElement;
    syncToggles(readConsent());
    prefs.hidden = false;
    document.documentElement.classList.add("cookie-prefs-open");
    document.addEventListener("keydown", onPrefsKeydown, true);
    var nodes = focusables();
    (nodes[0] || panel).focus();
  }

  function persist(consent) {
    writeConsent(consent);
    applyEmbeds(consent);
    hideBanner();
    closePrefs();
    try {
      document.dispatchEvent(new CustomEvent("wdyw-consent", { detail: consent }));
    } catch (e) {}
  }

  function onClick(event) {
    var prefsBtn = event.target.closest("[data-cookie-preferences]");
    if (prefsBtn) {
      event.preventDefault();
      openPrefs();
      return;
    }
    if (event.target.closest("[data-cookie-allow-all]")) {
      event.preventDefault();
      persist(defaultConsent({ functional: true, performance: true, targeting: true }));
      return;
    }
    if (event.target.closest("[data-cookie-necessary]")) {
      event.preventDefault();
      persist(defaultConsent());
      return;
    }
    if (event.target.closest("[data-cookie-save]")) {
      event.preventDefault();
      persist(readToggles());
      return;
    }
    if (event.target.closest("[data-cookie-prefs-dismiss]")) {
      event.preventDefault();
      closePrefs();
    }
  }

  document.addEventListener("click", onClick);

  window.WDYWConsent = {
    get: readConsent,
    has: function (category) {
      if (category === "necessary") return true;
      var consent = readConsent();
      return Boolean(consent && consent[category]);
    },
    openPreferences: openPrefs
  };

  var existing = readConsent();
  if (existing) {
    applyEmbeds(existing);
    hideBanner();
  } else {
    showBanner();
  }

  window.addEventListener("resize", syncBannerOffset);
})();
