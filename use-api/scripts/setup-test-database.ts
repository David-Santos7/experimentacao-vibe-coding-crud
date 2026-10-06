import "dotenv/config";
import { spawnSync } from "node:child_process";
import { assertSafeTestDatabase } from "../src/infrastructure/testing/assertSafeTestDatabase.js";

const databaseUrl = assertSafeTestDatabase();
const result = spawnSync(
  process.execPath,
  [
    "node_modules/prisma/build/index.js",
    "migrate",
    "deploy",
    "--config",
    "prisma7.config.ts",
  ],
  {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
