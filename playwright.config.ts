import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run preview",
    url: "http://openaq.org",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
