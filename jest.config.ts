import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Path to the root directory of your Next.js project
  dir: '.',  // This points to the root of your Next.js project (same as tsconfig.json baseUrl)
});

// Jest configuration object
const config: Config = {
  coverageProvider: 'v8',   // Enable v8 coverage collection
  testEnvironment: 'jsdom',  // Set the environment to jsdom for DOM-based testing
  
  // Optional: If you need a setup file for global configuration
  setupFilesAfterEnv: ['./jest.setup.ts'],
  
  // Add support for custom paths (like @components/*, @hooks/*) if needed
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',          // Custom path for @/* -> src/*
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@layout/(.*)$': '<rootDir>/layout/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@pages/(.*)$': '<rootDir>/pages/$1',
    '^@lib/(.*)$': '<rootDir>lib/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',

  },
};

export default createJestConfig(config);

