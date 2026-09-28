(function () {
  var form = document.querySelector("[data-subscribe]");
  if (!form) return;

  var status = document.getElementById("subscribe-status");
  var endpoint = (form.getAttribute("data-endpoint") || "").replace(/\/$/, "");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = (form.email.value || "").trim();
    var button = form.querySelector("button");

    if (!endpoint) {
      setStatus("Notifications are not configured yet.", true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Enter a valid email address.", true);
      return;
    }

    button.disabled = true;
    setStatus("Sending confirmation email…", false);

    fetch(endpoint + "/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email: email })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        var message = (result.data && result.data.message) || "Check your email to confirm.";
        setStatus(message, !result.ok);
        if (result.ok && result.data.status !== "already_subscribed") form.reset();
      })
      .catch(function () {
        setStatus("We could not send the confirmation email. Try again.", true);
      })
      .then(function () {
        button.disabled = false;
      });
  });

  function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }
})();
