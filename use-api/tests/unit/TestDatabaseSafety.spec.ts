import { describe, expect, it } from "vitest";
import { assertSafeTestDatabase } from "../../src/infrastructure/testing/assertSafeTestDatabase.js";

const safe = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://dev:secret@localhost/use_api_dev",
  TEST_DATABASE_URL: "postgresql://test:secret@127.0.0.1:5432/use_api_test",
};

describe("test database safety", () => {
  it("permits only an explicitly isolated destination", () => {
    expect(assertSafeTestDatabase(safe)).toBe(safe.TEST_DATABASE_URL);
  });
  it.each([
    { NODE_ENV: "production" },
    { TEST_DATABASE_URL: undefined },
    { DATABASE_URL: undefined },
    { TEST_DATABASE_URL: "invalid" },
    { TEST_DATABASE_URL: "postgresql://a:b@localhost/use_api_dev" },
    { DATABASE_URL: "postgresql://other:password@localhost/use_api_test" },
    { PRODUCTION_DATABASE_URL: safe.TEST_DATABASE_URL },
    { TEST_DATABASE_URL: `${safe.TEST_DATABASE_URL}?schema=public` },
  ])("rejects unsafe configuration before cleanup: %j", (override) => {
    let cleaned = false;
    expect(() => {
      assertSafeTestDatabase({ ...safe, ...override });
      cleaned = true;
    }).toThrow();
    expect(cleaned).toBe(false);
  });
});
