import urgentIdleCallback from "./urgent-idle-callback.js";

export default function (endpoint, metrics) {
  const callback = () => {
    fetch(endpoint, {
      body: JSON.stringify(metrics),
      method: "POST",
      keepalive: true,
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

  urgentIdleCallback(window, "pagehide", callback);
}
