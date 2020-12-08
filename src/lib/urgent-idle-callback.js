import { REQUESTIDLECALLBACK_SUPPORTED } from "./constants.js";

export function urgentIdleCallback (eventOwner, eventString, idleCallback) {
  if (REQUESTIDLECALLBACK_SUPPORTED) {
    let idleCallbackRan = false;
    const idleCallbackHandle = requestIdleCallback(() => {
      idleCallback();

      idleCallbackRan = true;
    });

    if (idleCallbackRan) {
      return;
    }

    eventOwner.addEventListener(eventString, () => {
      if (!idleCallbackRan) {
        cancelIdleCallback(idleCallbackHandle);
      }

      idleCallback();
    }, {
      once: true
    });
  } else {
    idleCallback();
  }
}
