import {
  readdirSync,
  readFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { relative, dirname, join } from "node:path";
import { tmpdir } from "node:os";
import ts from "typescript";
import { describe, expect, it } from "vitest";

function checkArchitecture(root: string): string[] {
  const files: string[] = [];
  const walk = (directory: string) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "generated") walk(path);
      } else if (entry.name.endsWith(".ts")) files.push(path);
    }
  };
  walk(join(root, "src"));
  const configPath = join(root, "tsconfig.json");
  const config = existsSync(configPath)
    ? ts.readConfigFile(configPath, ts.sys.readFile).config
    : { compilerOptions: { module: "nodenext" } };
  const options = ts.parseJsonConfigFileContent(config, ts.sys, root).options;
  const violations: string[] = [];
  const layer = (path: string) =>
    relative(join(root, "src"), path).replaceAll("\\", "/").split("/")[0];
  for (const required of ["domain", "application"]) {
    if (!files.some((file) => layer(file) === required))
      violations.push(`${required}: empty layer`);
  }
  const edges = new Map<string, string[]>();
  for (const file of files) {
    const sourceLayer = layer(file);
    const internal = sourceLayer === "domain" || sourceLayer === "application";
    const allowed =
      sourceLayer === "domain" ? ["domain"] : ["domain", "application"];
    const destinations: string[] = [];
    const inspect = (specifier: ts.Expression | undefined) => {
      if (!specifier || !ts.isStringLiteralLike(specifier)) {
        if (internal)
          violations.push(`${relative(root, file)}: nonliteral import`);
        return;
      }
      const name = specifier.text;
      const target = ts.resolveModuleName(name, file, options, ts.sys)
        .resolvedModule?.resolvedFileName;
      if (target) destinations.push(target);
      if (
        internal &&
        (!target ||
          !allowed.includes(layer(target) ?? "") ||
          target.includes("node_modules"))
      ) {
        violations.push(`${relative(root, file)} -> ${name}`);
      }
      if (sourceLayer === "adapters" && target && layer(target) === "main") {
        violations.push(`${relative(root, file)} -> composition root`);
      }
      if (
        sourceLayer === "infrastructure" &&
        target &&
        ["adapters", "main"].includes(layer(target) ?? "")
      ) {
        violations.push(`${relative(root, file)} -> ${name}`);
      }
      if (
        sourceLayer === "adapters" &&
        target &&
        layer(target) === "infrastructure" &&
        !target.replaceAll("\\", "/").includes("/infrastructure/generated/")
      ) {
        violations.push(`${relative(root, file)} -> infrastructure driver`);
      }
    };
    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        if (node.moduleSpecifier) inspect(node.moduleSpecifier);
      } else if (
        ts.isImportEqualsDeclaration(node) &&
        ts.isExternalModuleReference(node.moduleReference)
      ) {
        inspect(node.moduleReference.expression);
      } else if (
        ts.isImportTypeNode(node) &&
        ts.isLiteralTypeNode(node.argument)
      ) {
        inspect(node.argument.literal);
      } else if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) &&
            node.expression.text === "require"))
      ) {
        inspect(node.arguments[0]);
      }
      ts.forEachChild(node, visit);
    };
    visit(
      ts.createSourceFile(
        file,
        readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
      ),
    );
    edges.set(file, destinations);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const checkCycle = (file: string) => {
    if (visiting.has(file)) {
      violations.push(`dependency cycle: ${relative(root, file)}`);
      return;
    }
    if (visited.has(file)) return;
    visiting.add(file);
    for (const target of edges.get(file) ?? [])
      if (edges.has(target)) checkCycle(target);
    visiting.delete(file);
    visited.add(file);
  };
  for (const file of files) checkCycle(file);
  return violations;
}

describe("Clean Architecture boundaries", () => {
  it("checks every production module", () => {
    expect(checkArchitecture(process.cwd())).toEqual([]);
  });
  it.each([
    'import type { Request } from "express";',
    'export * from "../../infrastructure/generated/prisma/client.js";',
    'import "../barrel.js";',
    'import "@drivers/client";',
    'const path = "express"; void import(path);',
  ])("detects forbidden imports in a temporary tree: %s", (violation) => {
    const temporary = mkdtempSync(join(tmpdir(), "tcc-architecture-"));
    try {
      const write = (path: string, content: string) => {
        const destination = join(temporary, path);
        mkdirSync(dirname(destination), { recursive: true });
        writeFileSync(destination, content);
      };
      write(
        "tsconfig.json",
        JSON.stringify({
          compilerOptions: {
            module: "nodenext",
            paths: { "@drivers/*": ["./src/infrastructure/*"] },
          },
        }),
      );
      write("src/domain/entities/User.ts", "export class User {}");
      write("src/application/use-cases/Probe.ts", violation);
      write(
        "src/application/barrel.ts",
        'export * from "../infrastructure/client.js";',
      );
      write("src/infrastructure/client.ts", "export const external = true;");
      expect(checkArchitecture(temporary).length).toBeGreaterThan(0);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  });
});
