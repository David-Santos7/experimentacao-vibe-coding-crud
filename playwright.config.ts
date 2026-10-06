import { defineConfig, devices } from "@playwright/test";
import { API_URL, WEB_URL } from "./e2e/config";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: WEB_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.E2E_BROWSER_CHANNEL
          ? { channel: process.env.E2E_BROWSER_CHANNEL }
          : {}),
      },
    },
  ],
  webServer: [
    {
      command: "npm run dev:e2e --workspace use-api",
      url: `${API_URL}/users`,
      env: {
        PORT: new URL(API_URL).port || "3334",
        NODE_ENV: "test",
        FRONTEND_URL: WEB_URL,
      },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: `npm run dev --workspace use-web -- --host ${new URL(WEB_URL).hostname} --port ${new URL(WEB_URL).port || "5173"}`,
      url: `${WEB_URL}/users`,
      env: { VITE_API_URL: API_URL },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
