// Vendors
import { getCLS, getFCP, getFID, getLCP, getTTFB } from "web-vitals";

// Package-specific
import { CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED, LONGTASKS_SUPPORTED } from "./constants.js";
import { createMetric } from "./create-metric.js";
import { reportMetrics } from "./report-metrics.js";

export function grabVitals (endpoint, additionalMetrics = []) {
  // We only want to send a request once.
  let sent = false;

  const maxMetrics = [CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED].filter(supported => supported).length;
  const vitals = [];
  const longTasks = [];
  const sendCallback = () => {
    if (!sent) {
      reportMetrics(vitals, additionalMetrics, longTasks, endpoint);
      sent = true;
    }
  };

  // This callback fires if all metrics are collected before the user navigates
  // away from the current page (i.e., the best-case scenario).
  const pushMetric = ({ name, value }) => {
    if (name === "FID" && LONGTASKS_SUPPORTED) {
      // FID needs context. So we're going to look at long tasks!
      const longTaskObserver = new PerformanceObserver(list => {
        const longTasks = list.getEntries();

        for (var i = 0; i < longTasks.length; i++) {
          console.dir(longTasks[i]);
        }
      });

      longTaskObserver.observe({
        type: "longtask",
        buffered: true
      });
    }

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
