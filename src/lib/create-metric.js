export const createMetric = (name, value) => {
  const obj = {
    time: performance.now(),
    name,
    value
  };

  console.dir(obj);

  return obj;
};
