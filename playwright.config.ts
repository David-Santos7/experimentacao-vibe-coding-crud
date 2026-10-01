import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.CI ? {} : { channel: "chrome" }),
      },
    },
  ],
  webServer: [
    {
      command: "npm run dev:e2e --workspace use-api",
      url: "http://localhost:3334/users",
      env: { PORT: "3334" },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: "npm run dev --workspace use-web -- --host 127.0.0.1",
      url: "http://localhost:5173/users",
      env: { VITE_API_URL: "http://localhost:3334" },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
