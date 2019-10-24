/* istanbul ignore file */
module.exports = {
  alpha: {
    beta: {
      gamma: true,
    },
  },
  delta: () => true,
  epsilon: () => {
    return {
      zeta: () => () => () => true,
    };
  },
  eta: [
    1,
    () => 2,
    () => () => 3,
  ],
};
