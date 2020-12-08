import { urgentIdleCallback } from "./urgent-idle-callback.js";

export function sendFetch (endpoint, body) {
  urgentIdleCallback(window, "pagehide", () => {
    fetch(endpoint, {
      body,
      method: "POST",
      keepalive: true,
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
  });
}
