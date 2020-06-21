module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    "**/*.ts",
    "!**/node_modules/**",
  ]
};
