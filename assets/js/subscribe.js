// Progressive enhancement for the Relay signup form (_includes/subscribe-form.html).
// Without JS the form posts straight to Relay, which 303-redirects to
// /check-your-inbox/ or /subscribe-error/.
(function () {
  var form = document.querySelector("[data-subscribe]");
  if (!form) return;

  var status = document.getElementById("subscribe-status");
  var endpoint = form.getAttribute("action") || "";
  var startedAt = form.querySelector("[data-form-started-at]");
  var sourceUrl = form.querySelector("[data-source-url]");

  if (startedAt) startedAt.value = String(Date.now());
  if (sourceUrl) sourceUrl.value = window.location.href;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = (form.email.value || "").trim();
    var button = form.querySelector("button[type=submit]");
    var lists = Array.prototype.slice
      .call(form.querySelectorAll('input[name="list"]:checked'))
      .map(function (input) { return input.value; });

    if (!endpoint) {
      setStatus("Notifications are not configured yet.", true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Enter a valid email address.", true);
      return;
    }
    if (!lists.length) {
      setStatus("Pick at least one kind of email.", true);
      return;
    }
    if (!form.consent.checked) {
      setStatus("Tick the consent box so we can email you.", true);
      return;
    }

    button.disabled = true;
    setStatus("Sending…", false);

    // Relay accepts only ONE list per request, so we send one POST per checked list.
    // Note: Relay's resend throttle may skip the second confirmation email for the same
    // address. Switch this to a single multi-list request once Relay supports it.
    // Each POST also needs its own Turnstile token (tokens are single-use), so the
    // widget is reset and re-solved between requests.
    var chain = Promise.resolve([]);
    lists.forEach(function (list, index) {
      chain = chain.then(function (results) {
        var tokenReady = index === 0 ? Promise.resolve() : freshTurnstileToken();
        return tokenReady
          .then(function () { return post(list); })
          .then(function (result) { return results.concat([result]); });
      });
    });

    chain
      .then(function (results) {
        var failed = results.filter(function (r) { return !r.ok; });
        if (!failed.length) {
          setStatus("Check your inbox to confirm.", false);
          form.reset();
          if (startedAt) startedAt.value = String(Date.now());
        } else {
          setStatus(failed[0].message || "Something went wrong. Please try again.", true);
        }
      })
      .catch(function () {
        setStatus("We couldn't reach the signup service. Check your connection and try again.", true);
      })
      .then(function () {
        button.disabled = false;
        resetTurnstile();
      });
  });

  function post(list) {
    var data = new FormData(form);
    data.delete("list");
    data.append("list", list);
    return fetch(endpoint, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: data
    }).then(function (response) {
      return response.json().then(
        function (body) {
          return { ok: response.ok && body && body.ok !== false, message: body && body.message };
        },
        function () {
          return { ok: response.ok, message: null };
        }
      );
    });
  }

  function resetTurnstile() {
    if (window.turnstile && form.querySelector(".cf-turnstile")) {
      try { window.turnstile.reset(form.querySelector(".cf-turnstile")); } catch (e) {}
    }
  }

  // Reset the widget and wait (up to 15s) for a new token.
  function freshTurnstileToken() {
    var widget = form.querySelector(".cf-turnstile");
    if (!window.turnstile || !widget) return Promise.resolve();
    resetTurnstile();
    return new Promise(function (resolve) {
      var waited = 0;
      var timer = setInterval(function () {
        waited += 250;
        var token = "";
        try { token = window.turnstile.getResponse(widget) || ""; } catch (e) {}
        if (token || waited >= 15000) {
          clearInterval(timer);
          resolve();
        }
      }, 250);
    });
  }

  function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }
})();
