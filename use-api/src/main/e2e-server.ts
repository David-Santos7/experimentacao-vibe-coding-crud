import { assertSafeTestDatabase } from "../infrastructure/testing/assertSafeTestDatabase.js";
import "dotenv/config";

const testDatabaseUrl = assertSafeTestDatabase();

if (!testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL is not configured.");
}

process.env["DATABASE_URL"] = testDatabaseUrl;

const { app } = await import("./app.js");
const port = Number(process.env["PORT"] ?? 3333);

app.listen(port, () => {
  console.log(`E2E server listening on port ${port} with the test database.`);
});
