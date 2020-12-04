import { getCLS, getFID, getLCP, getFCP, getTTFB } from "web-vitals";
import gatherMetric from "./gather-metric.js";
import reportMetrics from "./report-metrics.js";

export function getVitals (endpoint, additionalMetrics = [], preferBeacon = true, polyfillFetch = false) {
  const metrics = [
    getCLS(gatherMetric),
    getFID(gatherMetric),
    getLCP(gatherMetric),
    getFCP(gatherMetric),
    getTTFB(gatherMetric)
  ];

  if (additionalMetrics.length) {
    additionalMetrics.forEach(([ name, value ]) => {
      metrics.push(gatherMetric(name, value));
    });
  }

  Promise.all(metrics).then(values => {
    reportMetrics(values, endpoint, preferBeacon, polyfillFetch);
  }).catch(error => {
    console.warn("get-vitals ran into an eerror reporting metrics:", "\n", error);
  });
}
