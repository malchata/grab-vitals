// Vendors
import { getTTFB } from "web-vitals";

// Package-specific
import { CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED } from "./constants.js";
import { createMetric } from "./create-metric.js";
import { reportMetrics } from "./report-metrics.js";

export function getVitals (endpoint, additionalMetrics = [], preferBeacon = true, polyfillFetch = false) {
  // We only want to send a request once.
  let sent = false;

  const maxMetrics = [CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED].filter(supported => supported).length;
  const vitals = [];
  const sendCallback = () => {
    if (!sent) {
      reportMetrics(vitals, additionalMetrics, endpoint, preferBeacon, polyfillFetch);
      sent = true;
    }
  };

  // This callback fires if all metrics are collected before the user navigates
  // away from the current page (i.e., the best-case scenario).
  const pushMetric = ({ name, value }) => {
    vitals.push(createMetric(name, value));

    if (vitals.length === maxMetrics) {
      sendCallback();
    }
  };

  if (CLS_SUPPORTED) {
    // webpack doesn't name chunks by default. The inline directive used below
    // just gives it a nice display name if the downstream bundler is webpack.
    import(/* webpackChunkName: "get-cls" */ "web-vitals/dist/modules/getCLS.js").then(({ getCLS }) => {
      getCLS(pushMetric);
    });

    window.addEventListener("visibilitychange", () => {
      if (document.visibilitystate === "hidden") {
        sendCallback();
      }
    }, {
      once: true
    });
  } else {
    window.addEventListener("pagehide", sendCallback, {
      capture: true,
      once: true
    });
  }

  if (FCP_SUPPORTED) {
    import(/* webpackChunkName: "get-fcp" */ "web-vitals/dist/modules/getFCP.js").then(({ getFCP }) => {
      getFCP(pushMetric);
    });
  }

  if (FID_SUPPORTED) {
    import(/* webpackChunkName: "get-fid" */ "web-vitals/dist/modules/getFID.js").then(({ getFID }) => {
      getFID(pushMetric);
    });
  }

  if (LCP_SUPPORTED) {
    import(/* webpackChunkName: "get-lcp" */ "web-vitals/dist/modules/getLCP.js").then(({ getLCP }) => {
      getLCP(pushMetric);
    });
  }

  getTTFB(pushMetric);
}
