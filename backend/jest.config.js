/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/__tests__/**",
    "!src/migrations/**",
    "!src/seeders/**",
    "!src/drizzle/migrations/**",
    "!src/types.ts",
    "!src/index.ts",
    "!src/services/emailService.ts",
    "!src/server.ts",
    "!src/config/**",
    "!src/drizzle/**",
    "!src/utils/logger.ts",
    "!src/middleware/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  verbose: true,
  displayName: {
    name: "Car Rental System",
    color: "blue"
  }
};