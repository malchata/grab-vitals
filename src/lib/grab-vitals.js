// Vendors
import { getCLS, getFCP, getFID, getLCP, getTTFB } from "web-vitals";

// Package-specific
import { CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED, SENDBEACON_SUPPORTED } from "./constants.js";
import { createMetric } from "./create-metric.js";
import { reportMetrics } from "./report-metrics.js";

export function grabVitals (endpoint, getFIDLongTasks = true, longTaskWindow = 2500, additionalMetrics) {
  if (SENDBEACON_SUPPORTED) {
    // We only want to send a request once.
    let sent = false;

    const maxMetrics = [CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED].filter(supported => supported).length;
    const vitals = [];
    const sendCallback = () => {
      if (!sent) {
        reportMetrics(vitals, endpoint, getFIDLongTasks, longTaskWindow, additionalMetrics);
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
      getCLS(pushMetric);

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
      getFCP(pushMetric);
    }

    if (FID_SUPPORTED) {
      getFID(pushMetric);
    }

    if (LCP_SUPPORTED) {
      getLCP(pushMetric);
    }

    if (TTFB_SUPPORTED) {
      getTTFB(pushMetric);
    }
  }
}
