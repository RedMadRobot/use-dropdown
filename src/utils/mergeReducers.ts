export const mergeReducers = (...reducers) =>
  (state, action) =>
    reducers
      .filter(Boolean)
      .reduce((prev, current) => current(prev, action), state)
