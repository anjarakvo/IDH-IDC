/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  verbose: true,
  transform: { "^.+\\.(ts|tsx|js|jsx)?$": "ts-jest" },
  setupFilesAfterEnv: ['./jest.setup.js']
};
