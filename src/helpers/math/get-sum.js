export const getSum = (values) => {
  console.log({ values });
  return values.reduce((accum, value) => {
    const result = accum + value;
    return result;
  }, 0);
};
