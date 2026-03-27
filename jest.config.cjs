module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.test.[jt]s?(x)',
    '<rootDir>/tests/**/*.spec.[jt]s?(x)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['dotenv/config'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};