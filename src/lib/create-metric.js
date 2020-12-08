export const createMetric = (name, value) => ({
  time: performance.now(),
  name,
  value
});
