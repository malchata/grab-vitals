import { SENDBEACON_SUPPORTED, FETCH_SUPPORTED } from "./constants.js";
import sendBeacon from "./send-beacon.js";
import sendFetch from "./send-fetch.js";

export default function (metrics, endpoint, preferBeacon, polyfillFetch) {
  if (metrics.filter(metric => metric === null).length === metrics.length) {
    return;
  }

  if (SENDBEACON_SUPPORTED && preferBeacon) {
    sendBeacon(endpoint, metrics);

    return;
  }

  if (FETCH_SUPPORTED) {
    sendFetch(endpoint, metrics);

    return;
  }

  if (polyfillFetch) {
    // webpack doesn't name chunks by default. The inline directive used below
    // just gives it a nice display name if the downstream bundler is webpack.
    import(/* webpackChunkName: "fetch-polyfill" */ "whatwg-fetch").then(() => {
      sendFetch(endpoint, metrics);
    }).catch(error => {
      console.warn("Couldn't load fetch polyfill:", "\n", error);
    });
  }
}
