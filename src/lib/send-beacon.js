import urgentIdleCallback from "./urgent-idle-callback.js";

export default function (endpoint, metrics) {
  const body = JSON.stringify(metrics);
  const callback = () => {
    navigator.sendBeacon(endpoint, JSON.stringify(body));
  };

  urgentIdleCallback(window, "pagehide", callback);
}
