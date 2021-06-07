import { SENDBEACON_SUPPORTED } from "./constants.js";
import { createMetric } from "./create-metric.js";

export function reportMetrics (vitals, additionalMetrics, longTasks, endpoint) {
  if (SENDBEACON_SUPPORTED) {
    navigator.sendBeacon(endpoint, JSON.stringify({
      pathName: document.location.pathname,
      metrics: [
        ...vitals,
        ...additionalMetrics.map(([ name, value ]) => createMetric(name, value))
      ]
    }));
  }
}
