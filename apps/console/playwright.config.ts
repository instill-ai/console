import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";

// import .env environment variables
dotenv.config();

if (!process.env.NEXT_PUBLIC_CONSOLE_BASE_URL) {
  throw new Error("NEXT_PUBLIC_CONSOLE_BASE_URL env not set");
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./integration-test",
  /* Maximum time one test can run for. */
  timeout: 40000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "line",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
    baseURL: process.env.NEXT_PUBLIC_CONSOLE_BASE_URL,

    // Because our backend is served with self-signed certification, we have to
    // ignore HTTPS error when operate the e2e test.
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 50,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    // Because on the first time login, we will demand user to change password,
    // so the first time login will use the default password. And then We will
    // use the changed password for the following test.
    {
      name: "first-time-login",
      testMatch: "first-time-login.test.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "chromium",
      testMatch: "main.test.ts",
      testIgnore: "first-time-login.test.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "integration-test/.auth/user.json",
      },
    },

    // Temp disable due to the viewport issue
    // https://github.com/microsoft/playwright/issues/22082

    {
      name: "firefox",
      testMatch: "main.test.ts",
      testIgnore: "first-time-login.test.ts",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "integration-test/.auth/user.json",
      },
    },

    {
      name: "webkit",
      testMatch: "main.test.ts",
      testIgnore: "first-time-login.test.ts",
      use: {
        ...devices["Desktop Safari"],
        storageState: "integration-test/.auth/user.json",
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
