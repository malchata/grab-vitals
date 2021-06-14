const PERF_OBSERVER_SUPPORTED = "PerformanceObserver" in window;

export const SENDBEACON_SUPPORTED = "sendBeacon" in navigator;
export const CLS_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("layout-shift");
export const FCP_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("paint");
export const FID_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("first-input");
export const LCP_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint");
export const TTFB_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("navigation");
export const LONGTASKS_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("longtask");
