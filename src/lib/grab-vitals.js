// Vendors
import { getCLS, getFCP, getFID, getLCP, getTTFB } from "web-vitals";

// Package-specific
import { CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED, LONGTASKS_SUPPORTED } from "./constants.js";
import { createMetric } from "./create-metric.js";
import { reportMetrics } from "./report-metrics.js";

export function grabVitals (endpoint, additionalMetrics, getFIDLongTasks = true, longTaskWindow = 1000, preferFetch = false) {
  // We only want to send a request once.
  let sent = false;

  const maxMetrics = [CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED].filter(supported => supported).length;
  const vitals = [];
  const sendCallback = () => {
    if (!sent) {
      reportMetrics(vitals, additionalMetrics, endpoint, preferFetch);
      sent = true;
    }
  };

  // This callback fires if all metrics are collected before the user navigates
  // away from the current page (i.e., the best-case scenario).
  const pushMetric = ({ name, value }) => {
    console.log(name, value);
    const metric = createMetric(name, value);

    if (name === "FID" && getFIDLongTasks && LONGTASKS_SUPPORTED) {
      const now = performance.now();
      const minWindow = now - (longTaskWindow / 2);
      const maxWindow = now + (longTaskWindow / 2);

      const longTaskObserver = new PerformanceObserver((list, observer) => {
        metric.longTasks = list.getEntries().filter(longTask => {
          return longTask.startTime >= minWindow && longTask.startTime <= maxWindow;
        });

        vitals.push(metric);

        if (vitals.length === maxMetrics) {
          sendCallback();
        }

        observer.disconnect();
      });

      longTaskObserver.observe({
        type: "longtask",
        buffered: true
      });
    } else {
      vitals.push(metric);
    }

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
