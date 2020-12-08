import { SENDBEACON_SUPPORTED, FETCH_SUPPORTED } from "./constants.js";
import { createMetric } from "./create-metric.js";
import { sendBeacon } from "./send-beacon.js";
import { sendFetch } from "./send-fetch.js";

export function reportMetrics (vitals, additionalMetrics, endpoint, preferBeacon, polyfillFetch) {
  const body = JSON.stringify({
    pathName: document.location.pathname,
    metrics: [
      ...vitals,
      ...additionalMetrics.map(([ name, value ]) => createMetric(name, value))
    ]
  });

  if (SENDBEACON_SUPPORTED && preferBeacon) {
    sendBeacon(endpoint, body);

    return;
  }

  if (FETCH_SUPPORTED) {
    sendFetch(endpoint, body);

    return;
  }

  if (polyfillFetch) {
    // webpack doesn't name chunks by default. The inline directive used below
    // just gives it a nice display name if the downstream bundler is webpack.
    import(/* webpackChunkName: "fetch-polyfill" */ "whatwg-fetch").then(() => {
      sendFetch(endpoint, body);
    }).catch(error => {
      console.warn("Couldn't load fetch polyfill:", "\n", error);
    });
  }
}
