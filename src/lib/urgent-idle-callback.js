import { REQUESTIDLECALLBACK_SUPPORTED } from "./constants.js";

export default function (eventOwner, eventString, idleCallback) {
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
    }, {
      once: true
    });
  } else {
    idleCallback();
  }
}
