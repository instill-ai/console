const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  modulePathIgnorePatterns: ["<rootDir>/e2e/"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/style/(.*)$": "<rootDir>/src/style/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/mocks/(.*)$": "<rootDir>/src/mocks/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
