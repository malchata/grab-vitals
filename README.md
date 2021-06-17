# grab-vitals

`grab-vitals` is a small script I wrote to gather and beacon [web vitals](https://web.dev/vitals/) gathered by [Google's `web-vitals` package](https://www.npmjs.com/package/web-vitals). The following metrics are collected:

- [Cumulative Layout Shift (CLS)](https://web.dev/cls/)
- [Largest Contentful Paint (LCP)](https://web.dev/lcp/)
- [First Input Delay (FID)](https://web.dev/fid/)
- [First Contentful Paint (FCP)](https://web.dev/fcp/)
- [Time to First Byte (TTFB)](https://en.wikipedia.org/wiki/Time_to_first_byte)

I originally wrote this as part of the codebase for my personal website, but decided to break this out into its own separate module for maintainability and for the off-chance that someone might find it useful. I hope maybe that someone is you!

## Installation

To use `grab-vitals` in your app, install it along the `web-vitals` package via npm as production dependencies:

`npm install grab-vitals --save`

You should not need to install `web-vitals` as a dependency in your app if you use this package. If you're already using the `web-vitals` in your own code, uninstall that dependency from your project and let this package handle reporting entirely for you, if possible. Otherwise, you may end up shipping two copies of `web-vitals`.

## Basic usage

The simplest usage of `grab-vitals` looks something like this:

```javascript
window.addEventListener("load", () => {
  import("grab-vitals").then(({ grabVitals }) => {
    grabVitals("https://metrics.compuhyperglobalmega.net/collect");
  });
});
```

In this example, we wait until the `window`'s `load` event to dynamically import the `grab-vitals` package. `grab-vitals` provides a `grabVitals` named function that accepts a URL endpoint where the metrics will be sent via [`navigator.sendBeacon`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon). Once this function is run, metrics are collected as they become available, and are eventually sent to the collection endpoint as a JSON-encoded object. That object has the following shape:

```javascript
{
  pathName,
  metrics: [
    {
      time,
      metric,
      value
    },
    // ...
  ]
}
```

The object contains the following data:

- `pathName` contains the value of `document.location.pathName`.
- `metrics` is an array of objects containing info on each metric. Each object in the array contains the following:
  - `time` contains the value of [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) roughly representing when the metric was captured.
  - `metric` is a string containing the metric name (e.g., `"cls"`, `"fid"`, _et. al_).
  - `value` is metric's value.

Depending on how you configure `grabVitals`, there may be some other object members, but this represents the bare minimum that `grab-vitals` will send to a collection endpoint.

Once ready, `grab-vitals` will send the JSON-encoded object in a POST request to the given endpoint. From there, it's up to you to write a back end that decodes that JSON (e.g., like PHP's [`json_decode`](https://www.php.net/json_decode)) and stores it somewhere for later analysis.

## Advanced configuration

The `grabVitals` function takes the following arguments in the order in which they're listed:

- `endpoint`: Required. The URL to the collection endpoint where a POST request containing the metrics will be sent. _Default: `undefined`._
- `getFIDLongTasks`: Optional. When set to `true`, `grab-vitals` will attempt to contextualize [First Input Delay](https://web.dev/fid/) by gathering data on long tasks from the [Long Tasks API](https://w3c.github.io/longtasks/) within a given window of time around the point at which the input delay was captured. This can be useful for contextualizing input delays, since a user's first input can vary wildly across different users. Long task data won't be collected in browsers that don't support the Long Tasks API. _Default: `true`._
- `longTaskWindow`: Optional. The window of time, in milliseconds, in which `grab-vitals` will search around the time of the input delay to look for long tasks. The window puts the input delay squarely in the middle, so a value of `5000` will mean that `grab-vitals` will look 2.5 seconds before and after the time of the input delay's capture to look for long tasks. _Default: `2500`._
- `additionalMetrics`: Optional. Additional metrics to transmit along with web vitals. Read on to see an example of this. _Default: `undefined`._

## Adding additional metrics

You may want to capture more stuff than just web vitals. Whatever that _stuff_ is, `grab-vitals` offers a way for you to transmit that information to your collection endpoint by way of the `additionalMetrics` parameter.

`additionalMetrics` does not expect data in any particular format, but storing those metrics in an array or an object is probably the best approach. For example, let's say you wanted to transmit characteristics of the user's current network connection along with the collected web vitals:

```javascript
window.addEventListener("load", () => {
  const metrics = [];

  if ("connection" in navigator) {
    metrics.push(
      {
        ect: navigator.connection.effectiveType
      }, {
        downlink: navigator.connection.downlink
      }, {
        rtt: navigator.connection.rtt
      }
    );
  }

  import("grab-vitals").then(({ grabVitals }) => {
    grabVitals("https://metrics.compuhyperglobalmega.net/collect", true, 2500, metrics);
  });
});
```

All that matters when you structure collection of additional metrics is that the values must be encodable by [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). When `additionalMetrics` is supplied, a new top-level object member named `additionalMetrics` will be created in the JSON payload that gets sent to your collection endpoint.

Now it's just up to you write a back-end script to collect everything!

## Handling metrics in your application back end

Once metrics start arriving at your designated endpoint, you need to decode the JSON on the back end and figure out what to do with it. Here's a barebones PHP example:

```php
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  // Takes raw data from the request.
  $json = file_get_contents("php://input");

  // Decode the JSON into something PHP can work with.
  $data = json_decode($json);

  // Access the path name:
  $pathName = $data->pathName;

  // Access web vitals
  foreach ($data->metrics as $metric) {
    // Process and store metrics here. Access object members like so:
    $metricTime = $metric->time;      // The time elapsed since the time origin.
    $metricName = $metric->name;      // The string name of the metric (e.g., "FID").
    $metricValue = $metric->value;    // The value of the associated metric (e.g., 22.3).

    // If long tasks are collected for FID, they'll be available in an array:
    if ($metricName === "FID") {
      // This assumes you're collecting long tasks. Always check to make sure
      // the value you're working with exists instead of just assuming it does!
      $fidLongTasks = $metric->longTasks;
    }
  }
}
?>
```

However you do this on your application back end depends on the language you're using, but this should give you a barebones idea of how to work with the data `grab-vitals` sends.

## Contributing

I mostly did this as a proof of concept to try and simplify my metrics collection efforts. If you find it useful, great! If you have ideas for contributing, that depends on what you want to contribute. If you want to extend this to do something specific to your situation, just fork the package. If you find bugs or have a novel feature request, file an issue!
