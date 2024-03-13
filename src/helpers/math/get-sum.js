export const getSum = (values) => {
  const result = values.reduce((accum, value) => {
    return accum + value;
  }, 0);
  return parseFloat(result).toFixed(2);
};
