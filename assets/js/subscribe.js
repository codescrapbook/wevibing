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
    var checkedLists = form.querySelectorAll('input[name="list[]"]:checked');

    if (!endpoint) {
      setStatus("Notifications are not configured yet.", true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Enter a valid email address.", true);
      return;
    }
    if (!checkedLists.length) {
      setStatus("Pick at least one kind of email: stream alerts or new blog posts.", true);
      return;
    }
    if (!form.consent.checked) {
      setStatus("Tick the consent box so we can email you.", true);
      return;
    }

    button.disabled = true;
    setStatus("Sending…", false);

    // One request with every checked list (list[]). Relay sends a single
    // confirmation email that covers all of the chosen lists.
    fetch(endpoint, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    })
      .then(function (response) {
        return response.json().then(
          function (body) {
            return { ok: response.ok && body && body.ok !== false, message: body && body.message };
          },
          function () {
            return { ok: response.ok, message: null };
          }
        );
      })
      .then(function (result) {
        if (result.ok) {
          setStatus("Check your inbox to confirm.", false);
          form.reset();
          if (startedAt) startedAt.value = String(Date.now());
        } else {
          setStatus(result.message || "Something went wrong. Please try again.", true);
        }
      })
      .catch(function () {
        setStatus("We couldn't reach the signup service. Check your connection and try again.", true);
      })
      .then(function () {
        button.disabled = false;
        // Turnstile tokens are single-use; get a fresh one for any later submit.
        var widget = form.querySelector(".cf-turnstile");
        if (window.turnstile && widget) {
          try { window.turnstile.reset(widget); } catch (e) {}
        }
      });
  });

  function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }
})();
