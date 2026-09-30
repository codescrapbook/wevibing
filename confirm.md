---
layout: page
title: Confirm subscription
permalink: /confirm/
sitemap: false
---

<p id="confirm-status" class="subscribe-status" role="status">Open the link from your email, then confirm to subscribe.</p>

<form class="confirm-form" id="confirm-form" data-confirm data-endpoint="{{ site.subscribe.endpoint }}">
  <input type="hidden" name="token" id="confirm-token" />
  <button type="submit">Confirm subscription</button>
</form>

<p class="subscribe-note">You will get book club dates, stream go-live alerts, and new posts only after this confirmation.</p>

<script src="{{ '/assets/js/confirm.js' | relative_url }}" defer></script>
