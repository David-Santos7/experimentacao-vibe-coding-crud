type TestEnvironment = Record<string, string | undefined>;

function destination(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Invalid database URL.");
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("Test database must use PostgreSQL.");
  }
  if (!url.hostname || !url.pathname || url.search || url.hash) {
    throw new Error("Database URL must identify one explicit destination.");
  }
  const host = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    ? "loopback"
    : url.hostname.toLowerCase();
  return `${host}:${url.port || "5432"}/${decodeURIComponent(url.pathname.slice(1))}`;
}

export function assertSafeTestDatabase(
  env: TestEnvironment = process.env,
): string {
  const testUrl = env["TEST_DATABASE_URL"];
  const developmentUrl = env["DATABASE_URL"];
  if (env["NODE_ENV"] !== "test" || !testUrl || !developmentUrl) {
    throw new Error(
      "Explicit test environment and separate database URLs are required.",
    );
  }
  const testDestination = destination(testUrl);
  if (!testDestination.endsWith("/use_api_test")) {
    throw new Error(
      "Only use_api_test is permitted for destructive test operations.",
    );
  }
  const protectedUrls = [developmentUrl, env["PRODUCTION_DATABASE_URL"]].filter(
    (value): value is string => Boolean(value),
  );
  if (protectedUrls.some((value) => destination(value) === testDestination)) {
    throw new Error(
      "Test database must differ from protected database destinations.",
    );
  }
  return testUrl;
}
