(function () {
  var form = document.querySelector("[data-confirm]");
  if (!form) return;

  var status = document.getElementById("confirm-status");
  var endpoint = (form.getAttribute("data-endpoint") || "").replace(/\/$/, "");
  var params = new URLSearchParams(window.location.search);
  var token = params.get("token") || "";
  var tokenInput = document.getElementById("confirm-token");
  if (tokenInput) tokenInput.value = token;

  if (!token) {
    form.hidden = true;
    setStatus("This confirmation link is missing a token.", true);
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var button = form.querySelector("button");
    if (!endpoint) {
      setStatus("Notifications are not configured yet.", true);
      return;
    }

    button.disabled = true;
    setStatus("Confirming your subscription…", false);

    fetch(endpoint + "/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ token: token })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        var message = (result.data && result.data.message) || "This confirmation link is invalid.";
        setStatus(message, !result.ok);
        if (result.ok) form.hidden = true;
        else button.disabled = false;
      })
      .catch(function () {
        setStatus("We could not confirm this subscription. Try again.", true);
        button.disabled = false;
      });
  });

  function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }
})();
