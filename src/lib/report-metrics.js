import { LONGTASKS_SUPPORTED } from "./constants.js";

export function reportMetrics (vitals, endpoint, getFIDLongTasks, longTaskWindow, additionalMetrics) {
  const beaconCallback = () => {
    const payload = {
      pathName: document.location.pathname,
      metrics: vitals
    };

    if (typeof additionalMetrics !== "undefined") {
      payload.additionalMetrics = additionalMetrics;
    }

    navigator.sendBeacon(endpoint, JSON.stringify(payload));
  };

  if (getFIDLongTasks && LONGTASKS_SUPPORTED) {
    for (const vitalIndex in vitals) {
      if (vitals[vitalIndex].name === "FID") {
        const minWindow = vitals[vitalIndex].time - (longTaskWindow / 2);
        const maxWindow = vitals[vitalIndex].time + (longTaskWindow / 2);

        const longTaskObserver = new PerformanceObserver((list, observer) => {
          vitals[vitalIndex].longTasks = list.getEntries().filter(longTask => {
            return longTask.startTime >= minWindow && longTask.startTime <= maxWindow;
          });

          observer.disconnect();
          beaconCallback();
        });

        longTaskObserver.observe({
          type: "longtask",
          buffered: true
        });

        break;
      }
    }

    return;
  }

  beaconCallback();
}
