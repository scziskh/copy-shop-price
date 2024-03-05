export const getSum = (...values) => {
  return values.reduce((accum, value) => accum + value, 0);
};
