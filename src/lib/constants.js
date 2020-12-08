export const SENDBEACON_SUPPORTED = "sendBeacon" in navigator;
export const FETCH_SUPPORTED = "fetch" in window;
export const REQUESTIDLECALLBACK_SUPPORTED = "requestIdleCallback" in window;
export const CLS_SUPPORTED = PerformanceObserver.supportedEntryTypes.includes("layout-shift");
export const FCP_SUPPORTED = PerformanceObserver.supportedEntryTypes.includes("paint");
export const FID_SUPPORTED = PerformanceObserver.supportedEntryTypes.includes("first-input");
export const LCP_SUPPORTED = PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint");
export const TTFB_SUPPORTED = PerformanceObserver.supportedEntryTypes.includes("navigation");
