var e,t,n,i,a=function(e,t){return {name:e,value:void 0===t?-1:t,delta:0,entries:[],id:"v1-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12)}},r=function(e,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){if("first-input"===e&&!("PerformanceEventTiming"in self))return;var n=new PerformanceObserver((function(e){return e.getEntries().map(t)}));return n.observe({type:e,buffered:!0}),n}}catch(e){}},o=function(e,t){var n=function n(i){"pagehide"!==i.type&&"hidden"!==document.visibilityState||(e(i),t&&(removeEventListener("visibilitychange",n,!0),removeEventListener("pagehide",n,!0)));};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0);},c=function(e){addEventListener("pageshow",(function(t){t.persisted&&e(t);}),!0);},u="function"==typeof WeakSet?new WeakSet:new Set,f=function(e,t,n){var i;return function(){t.value>=0&&(n||u.has(t)||"hidden"===document.visibilityState)&&(t.delta=t.value-(i||0),(t.delta||void 0===i)&&(i=t.value,e(t)));}},s=function(e,t){var n,i=a("CLS",0),u=function(e){e.hadRecentInput||(i.value+=e.value,i.entries.push(e),n());},s=r("layout-shift",u);s&&(n=f(e,i,t),o((function(){s.takeRecords().map(u),n();})),c((function(){i=a("CLS",0),n=f(e,i,t);})));},m=-1,p=function(){return "hidden"===document.visibilityState?0:1/0},v=function(){o((function(e){var t=e.timeStamp;m=t;}),!0);},d=function(){return m<0&&(m=p(),v(),c((function(){setTimeout((function(){m=p(),v();}),0);}))),{get timeStamp(){return m}}},l=function(e,t){var n,i=d(),o=a("FCP"),s=function(e){"first-contentful-paint"===e.name&&(p&&p.disconnect(),e.startTime<i.timeStamp&&(o.value=e.startTime,o.entries.push(e),u.add(o),n()));},m=performance.getEntriesByName("first-contentful-paint")[0],p=m?null:r("paint",s);(m||p)&&(n=f(e,o,t),m&&s(m),c((function(i){o=a("FCP"),n=f(e,o,t),requestAnimationFrame((function(){requestAnimationFrame((function(){o.value=performance.now()-i.timeStamp,u.add(o),n();}));}));})));},h={passive:!0,capture:!0},S=new Date,y=function(i,a){e||(e=a,t=i,n=new Date,w(removeEventListener),g());},g=function(){if(t>=0&&t<n-S){var a={entryType:"first-input",name:e.type,target:e.target,cancelable:e.cancelable,startTime:e.timeStamp,processingStart:e.timeStamp+t};i.forEach((function(e){e(a);})),i=[];}},E=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){y(e,t),a();},i=function(){a();},a=function(){removeEventListener("pointerup",n,h),removeEventListener("pointercancel",i,h);};addEventListener("pointerup",n,h),addEventListener("pointercancel",i,h);}(t,e):y(t,e);}},w=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,E,h)}));},L=function(n,s){var m,p=d(),v=a("FID"),l=function(e){e.startTime<p.timeStamp&&(v.value=e.processingStart-e.startTime,v.entries.push(e),u.add(v),m());},h=r("first-input",l);m=f(n,v,s),h&&o((function(){h.takeRecords().map(l),h.disconnect();}),!0),h&&c((function(){var r;v=a("FID"),m=f(n,v,s),i=[],t=-1,e=null,w(addEventListener),r=l,i.push(r),g();}));},T=function(e,t){var n,i=d(),s=a("LCP"),m=function(e){var t=e.startTime;t<i.timeStamp&&(s.value=t,s.entries.push(e)),n();},p=r("largest-contentful-paint",m);if(p){n=f(e,s,t);var v=function(){u.has(s)||(p.takeRecords().map(m),p.disconnect(),u.add(s),n());};["keydown","click"].forEach((function(e){addEventListener(e,v,{once:!0,capture:!0});})),o(v,!0),c((function(i){s=a("LCP"),n=f(e,s,t),requestAnimationFrame((function(){requestAnimationFrame((function(){s.value=performance.now()-i.timeStamp,u.add(s),n();}));}));}));}},b=function(e){var t,n=a("TTFB");t=function(){try{var t=performance.getEntriesByType("navigation")[0]||function(){var e=performance.timing,t={entryType:"navigation",startTime:0};for(var n in e)"navigationStart"!==n&&"toJSON"!==n&&(t[n]=Math.max(e[n]-e.navigationStart,0));return t}();if(n.value=n.delta=t.responseStart,n.value<0)return;n.entries=[t],e(n);}catch(e){}},"complete"===document.readyState?setTimeout(t,0):addEventListener("pageshow",t);};

const PERF_OBSERVER_SUPPORTED = "PerformanceObserver" in window;
const SENDBEACON_SUPPORTED = "sendBeacon" in navigator;
const CLS_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("layout-shift");
const FCP_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("paint");
const FID_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("first-input");
const LCP_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint");
const TTFB_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("navigation");
const LONGTASKS_SUPPORTED = PERF_OBSERVER_SUPPORTED && PerformanceObserver.supportedEntryTypes.includes("longtask");

const createMetric = (name, value) => {
  const obj = {
    time: performance.now(),
    name,
    value
  };

  console.dir(obj);

  return obj;
};

function reportMetrics (vitals, additionalMetrics, longTasks, endpoint) {
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

// Vendors

function grabVitals (endpoint, additionalMetrics = []) {
  // We only want to send a request once.
  let sent = false;

  const maxMetrics = [CLS_SUPPORTED, FCP_SUPPORTED, FID_SUPPORTED, LCP_SUPPORTED, TTFB_SUPPORTED].filter(supported => supported).length;
  const vitals = [];
  const longTasks = [];
  const sendCallback = () => {
    if (!sent) {
      reportMetrics(vitals, additionalMetrics, longTasks, endpoint);
      sent = true;
    }
  };

  // This callback fires if all metrics are collected before the user navigates
  // away from the current page (i.e., the best-case scenario).
  const pushMetric = ({ name, value }) => {
    if (name === "FID" && LONGTASKS_SUPPORTED) {
      // FID needs context. So we're going to look at long tasks!
      const longTaskObserver = new PerformanceObserver(list => {
        const longTasks = list.getEntries();

        for (var i = 0; i < longTasks.length; i++) {
          console.dir(longTasks[i]);
        }
      });

      longTaskObserver.observe({
        type: "longtask",
        buffered: true
      });
    }

    vitals.push(createMetric(name, value));

    if (vitals.length === maxMetrics) {
      sendCallback();
    }
  };

  if (CLS_SUPPORTED) {
    s(pushMetric);

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
    l(pushMetric);
  }

  if (FID_SUPPORTED) {
    L(pushMetric);
  }

  if (LCP_SUPPORTED) {
    T(pushMetric);
  }

  if (TTFB_SUPPORTED) {
    b(pushMetric);
  }
}

export { grabVitals };
