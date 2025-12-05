// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const path = require('path');
const { resolve } = path;

const root = resolve(__dirname);

module.exports = {
    rootDir: root,
    displayName: 'root-tests',
    preset: 'ts-jest',
    testEnvironment: 'node',

    // All imported modules in your tests should be mocked automatically
    automock: false,

    // Stop running tests after `n` failures
    bail: true,

    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],

    // The directory where Jest should output its coverage files
    coverageDirectory: 'tests/coverage',

    // A list of reporter names that Jest uses when writing coverage reports
    coverageReporters: ['text', 'lcovonly'],

    // The test environment that will be used for testing
    testEnvironment: 'node',

    // The glob patterns Jest uses to detect test files
    testMatch: ['**/tests/unit/**/*.spec.ts', '**/tests/integration/**/*.spec.ts'],

    // A map from regular expressions to paths to transformers
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },

    // An array of regexp pattern strings that are matched against all source file paths before re-running tests in watch mode
    transformIgnorePatterns: ['<rootDir>/node_modules/'],

    // Indicates whether each individual test should be reported during the run
    verbose: true,

    // Module file extensions
    moduleFileExtensions: ['ts', 'js', 'json'],

    // Module name mapper for path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};

