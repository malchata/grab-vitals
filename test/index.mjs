var e,t,n,i,a=function(e,t){return {name:e,value:void 0===t?-1:t,delta:0,entries:[],id:"v2-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12)}},r=function(e,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){if("first-input"===e&&!("PerformanceEventTiming"in self))return;var n=new PerformanceObserver((function(e){return e.getEntries().map(t)}));return n.observe({type:e,buffered:!0}),n}}catch(e){}},o=function(e,t){var n=function n(i){"pagehide"!==i.type&&"hidden"!==document.visibilityState||(e(i),t&&(removeEventListener("visibilitychange",n,!0),removeEventListener("pagehide",n,!0)));};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0);},u=function(e){addEventListener("pageshow",(function(t){t.persisted&&e(t);}),!0);},c="function"==typeof WeakSet?new WeakSet:new Set,f=function(e,t,n){var i;return function(){t.value>=0&&(n||c.has(t)||"hidden"===document.visibilityState)&&(t.delta=t.value-(i||0),(t.delta||void 0===i)&&(i=t.value,e(t)));}},s=-1,m=function(){return "hidden"===document.visibilityState?0:1/0},d=function(){o((function(e){var t=e.timeStamp;s=t;}),!0);},v=function(){return s<0&&(s=m(),d(),u((function(){setTimeout((function(){s=m(),d();}),0);}))),{get firstHiddenTime(){return s}}},p=function(e,t){var n,i=v(),o=a("FCP"),s=function(e){"first-contentful-paint"===e.name&&(d&&d.disconnect(),e.startTime<i.firstHiddenTime&&(o.value=e.startTime,o.entries.push(e),c.add(o),n()));},m=performance.getEntriesByName&&performance.getEntriesByName("first-contentful-paint")[0],d=m?null:r("paint",s);(m||d)&&(n=f(e,o,t),m&&s(m),u((function(i){o=a("FCP"),n=f(e,o,t),requestAnimationFrame((function(){requestAnimationFrame((function(){o.value=performance.now()-i.timeStamp,c.add(o),n();}));}));})));},l=!1,h=-1,y=function(e,t){l||(p((function(e){h=e.value;})),l=!0);var n,i=function(t){h>-1&&e(t);},c=a("CLS",0),s=0,m=[],d=function(e){if(!e.hadRecentInput){var t=m[0],i=m[m.length-1];s&&e.startTime-i.startTime<1e3&&e.startTime-t.startTime<5e3?(s+=e.value,m.push(e)):(s=e.value,m=[e]),s>c.value&&(c.value=s,c.entries=m,n());}},v=r("layout-shift",d);v&&(n=f(i,c,t),o((function(){v.takeRecords().map(d),n();})),u((function(){s=0,h=-1,c=a("CLS",0),n=f(i,c,t);})));},g={passive:!0,capture:!0},T=new Date,E=function(i,a){e||(e=a,t=i,n=new Date,L(removeEventListener),S());},S=function(){if(t>=0&&t<n-T){var a={entryType:"first-input",name:e.type,target:e.target,cancelable:e.cancelable,startTime:e.timeStamp,processingStart:e.timeStamp+t};i.forEach((function(e){e(a);})),i=[];}},w=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){E(e,t),a();},i=function(){a();},a=function(){removeEventListener("pointerup",n,g),removeEventListener("pointercancel",i,g);};addEventListener("pointerup",n,g),addEventListener("pointercancel",i,g);}(t,e):E(t,e);}},L=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,w,g)}));},b=function(n,s){var m,d=v(),p=a("FID"),l=function(e){e.startTime<d.firstHiddenTime&&(p.value=e.processingStart-e.startTime,p.entries.push(e),c.add(p),m());},h=r("first-input",l);m=f(n,p,s),h&&o((function(){h.takeRecords().map(l),h.disconnect();}),!0),h&&u((function(){var r;p=a("FID"),m=f(n,p,s),i=[],t=-1,e=null,L(addEventListener),r=l,i.push(r),S();}));},F=function(e,t){var n,i=v(),s=a("LCP"),m=function(e){var t=e.startTime;t<i.firstHiddenTime&&(s.value=t,s.entries.push(e)),n();},d=r("largest-contentful-paint",m);if(d){n=f(e,s,t);var p=function(){c.has(s)||(d.takeRecords().map(m),d.disconnect(),c.add(s),n());};["keydown","click"].forEach((function(e){addEventListener(e,p,{once:!0,capture:!0});})),o(p,!0),u((function(i){s=a("LCP"),n=f(e,s,t),requestAnimationFrame((function(){requestAnimationFrame((function(){s.value=performance.now()-i.timeStamp,c.add(s),n();}));}));}));}},k=function(e){var t,n=a("TTFB");t=function(){try{var t=performance.getEntriesByType("navigation")[0]||function(){var e=performance.timing,t={entryType:"navigation",startTime:0};for(var n in e)"navigationStart"!==n&&"toJSON"!==n&&(t[n]=Math.max(e[n]-e.navigationStart,0));return t}();if(n.value=n.delta=t.responseStart,n.value<0)return;n.entries=[t],e(n);}catch(e){}},"complete"===document.readyState?setTimeout(t,0):addEventListener("pageshow",t);};

const PERF_OBSERVER_SUPPORTED = "PerformanceObserver" in window;
const SENDBEACON_SUPPORTED = "sendBeacon" in navigator;
const CLS_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("layout-shift");
const FCP_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("paint");
const FID_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("first-input");
const LCP_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint");
const TTFB_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("navigation");
const LONGTASKS_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("longtask");

const createMetric = (name, value) => ({
  name,
  value
});

function reportMetrics (vitals, additionalMetrics, endpoint, preferFetch = true) {
  const payload = {
    pathName: document.location.pathname,
    metrics: vitals
  };

  if (typeof additionalMetrics !== "undefined") {
    payload.additionalMetrics = additionalMetrics;
  }

  const body = JSON.stringify(payload);

  if (SENDBEACON_SUPPORTED && !preferFetch) {
    navigator.sendBeacon(endpoint, body);
  } else {
    fetch(endpoint, {
      body,
      method: "POST",
      keepalive: true,
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

// Vendors

function grabVitals (endpoint, additionalMetrics, getFIDLongTasks = true, longTaskWindow = 1000, preferFetch = false) {
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
    y(pushMetric);

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
    p(pushMetric);
  }

  if (FID_SUPPORTED) {
    b(pushMetric);
  }

  if (LCP_SUPPORTED) {
    F(pushMetric);
  }

  if (TTFB_SUPPORTED) {
    k(pushMetric);
  }
}

export { grabVitals };
