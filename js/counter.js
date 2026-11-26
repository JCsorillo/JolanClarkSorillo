// v2.2.0
import { CONFIG } from "./config.js";

const badge = document.getElementById("visitor-counter");
const value = badge?.querySelector("[data-counter-value]");

function readConsent() {
  try {
    return localStorage.getItem("jcs_cookie_consent") === "all";
  } catch {
    return false;
  }
}

function hideBadge() {
  if (badge) badge.hidden = true;
}

async function loadVisitorCount() {
  if (!badge || !value) return;
  if (!readConsent() || !CONFIG.COUNTER_URL) {
    hideBadge();
    return;
  }

  let alreadyCounted = false;
  try {
    alreadyCounted = sessionStorage.getItem("jcs_counted") === "counted";
  } catch {}

  const url = new URL(CONFIG.COUNTER_URL);
  url.searchParams.set("action", alreadyCounted ? "count" : "hit");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      mode: "cors",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) return hideBadge();
    const payload = await response.json();
    const count = Number(payload.count);
    if (!payload.ok || !Number.isSafeInteger(count) || count < 0) return hideBadge();
    value.textContent = `Visitors: ${count.toLocaleString()}`;
    badge.dataset.state = "online";
    if (!alreadyCounted) {
      try { sessionStorage.setItem("jcs_counted", "counted"); } catch {}
    }
  } catch {
    hideBadge();
  } finally {
    window.clearTimeout(timeout);
  }
}

loadVisitorCount();
