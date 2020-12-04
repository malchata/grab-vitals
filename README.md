# get-vitals

`get-vitals` is a small utility I wrote to gather and beacon [web vitals](https://web.dev/vitals/) gathered by [Google's `web-vitals` package](https://www.npmjs.com/package/web-vitals). The following metrics are collected:

- [Cumulative Layout Shift (CLS)](https://web.dev/cls/)
- [Largest Contentful Paint (LCP)](https://web.dev/lcp/)
- [First Input Delay (FID)](https://web.dev/fid/)
- [First Contentful Paint (FCP)](https://web.dev/fcp/)
- [Time to First Byte (TTFB)](https://en.wikipedia.org/wiki/Time_to_first_byte)

I originally wrote this as part of the codebase for my personal website, but decided to break this out into its own separate module for maintainability and for the off-chance that someone might find it useful.

## Installation

To use `get-vitals` in your app, install it along the `web-vitals` package via npm as production dependencies:

`npm install @malchata/get-vitals web-vitals --save`

The `web-vitals` package is marked as external in this package. The reason for this is to avoid shipping a copy of the `web-vitals` package for flexibility. This may change in a future release.

## Basic usage

Using `get-vitals` is designed to be as straightforward as it can possibly be:

```javascript
import { getVitals } from "@malchata/get-vitals";

window.addEventListener("load", () => {
  getVitals("https://metrics.compuhyperglobalmega.net/collect");
});
```

In this example, `get-vitals` will pack all the metrics that `get-vitals` provides into an array of objects after the page `load` event fires. Each object in the array has the following shape:

```javascript
{
  pathName,
  metric,
  value
}
```

`pathName` contains the value of `document.location.pathName`, `metric` is a string of the metric name (e.g., `"cls"`, `"fid"`, _et. al_), and `value` is, well, the _value_ of the metric.

Once all metrics are collected, the array of objects is converted to a JSON string and sent as a POST request to the endpoint passed to the `getVitals` function. From there, it's up to you to write a back end that decodes that JSON (e.g., like PHP's [`json_decode`](https://www.php.net/json_decode)) and stores it somewhere for later analysis.

## Advanced usage

The `getVitals` function takes the following arguments in the order in which they're listed:

- `endpoint` (`String`): The endpoint where a POST request containing the metrics will be sent.
- `additionalMetrics` (`Array`): Additional metrics to transmit along with web vitals. Read on to see an example of this. Default: `[]`.
- `preferBeacon` (`Boolean`): Whether to prefer [`navigator.sendBeacon`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) over [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). `sendBeacon` is much more passive than a fetch, but may fail to fire for a number of good reasons based on browser heuristics. Don't change this unless capturing anything less than 100% is flat-out unacceptable. Default: `true`.
- `polyfillFetch` (`Boolean`): Whether to polyfill the fetch API. If you do this, you'll need to install the [`whatwg-fetch` package](https://www.npmjs.com/package/whatwg-fetch) as a production dependency in your project if you set this to `true`. If `false`, you'll either need to polyfill `fetch` some other way, or accept that metrics won't be transmitted in browsers that don't support either `fetch` or `sendBeacon`.

Aside from toggling `preferBeacon` or `polyfillFetch` one way or the other, the only advanced use case is supplying your own metrics, which is where `additionalMetrics` comes in. Let's have a look at what that might look like.

```javascript
export function getAdditionalMetrics () {
  const metrics = [];

  // Let's gather some netinfo stuff if we can
  if ("connection" in navigator) {
    metrics.push(["ect", navigator.connection.effectiveType]);
    metrics.push(["downlink", navigator.connection.downlink]);
    metrics.push(["rtt", navigator.connection.rtt]);
  }

  return metrics;
}
```

`additionalMetrics` expects an array of arrays. Each sub-array must consist of the following members in the following order:

1. The name of the metric (`String`).
2. The value of the metric. (`String`, `Number`, whatever type you're willing to process in your back end).

Using this format, we `push` some [netinfo metrics](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) we want to send to our analytics collection endpoint, and return the `metrics` array. In the collection script, we then pass that array to the `getVitals` function:

```javascript
import { getAdditionalMetrics } from "./get-additional-metrics.js";

window.addEventListener("load", () => {
  const additionalMetrics = getAdditionalMetrics();

  getVitals(RUM_ENDPOINT, additionalMetrics);
});
```

`get-vitals` handles everything from there! Now it's just up to you write a back-end script to collect everything.

## Handling metrics in your application back end

`get-vitals` sends a JSON representation of an array in a POST request to the specified endpoint. From there, you need to decode the JSON and figure out what to do with it. Here's a barebones PHP example:

```php
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  // Takes raw data from the request.
  $json = file_get_contents("php://input");

  // Decode the JSON into something PHP can work with.
  $data = json_decode($json);

  foreach ($data as $metric) {
    // Process and store metrics here. Access object members like so:
    echo $metric->pathName;  // The path to the page where collection happened.
    echo $metric->name;      // The string name of the metric (e.g., "cls").
    echo $metric->value;     // The value of the associated metric (e.g., 22).
  }
}
?>
```

However you do this on your application back end depends on the language you're using, but this should give you a barebones idea of how to work with the data `get-vitals` sends.

## Contributing

I mostly did this as a proof of concept to try and simplify my metrics collection efforts. If you find it useful, great! If you have ideas for contributing, that depends on what you want to contribute. If you want to extend this to do something specific to your situation, just fork the package. If you find bugs or have a novel feature request, file an issue and we'll talk!

## That's all.

okay we're done buh-bye you can go do other stuff now 👋
