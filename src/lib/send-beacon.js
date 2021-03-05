import { urgentIdleCallback } from "./urgent-idle-callback.js";

export function sendBeacon (endpoint, body) {
  urgentIdleCallback(window, "pagehide", () => {
    navigator.sendBeacon(endpoint, body);
  });
}
