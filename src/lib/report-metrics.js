import { SENDBEACON_SUPPORTED } from "./constants.js";

export function reportMetrics (vitals, additionalMetrics, endpoint, preferFetch = true) {
  const payload = {
    pathName: document.location.pathname,
    metrics: vitals
  };

  if (typeof additionalMetrics !== "undefined") {
    payload.additionalMetrics = additionalMetrics;
  }

  const body = JSON.stringify(payload);

  if (SENDBEACON_SUPPORTED && !preferFetch) {
    navigator.sendBeacon(endpoint, body);
  } else {
    fetch(endpoint, {
      body,
      method: "POST",
      keepalive: true,
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
