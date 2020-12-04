import createMetric from "./create-metric.js";

export default function ({ name, value }) {
  return new Promise((resolve, reject) => {
    try {
      if (value) {
        resolve(createMetric(name, value));
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
}
