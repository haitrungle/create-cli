import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { createCommandContext } from "gunshi";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { app } from "../src/cli.js";

// Mock prompts to avoid interactivity if arguments fail
vi.mock("prompts", () => {
  return {
    default: vi.fn(() => Promise.resolve({ projectName: "prompt-app", overwrite: true })),
  };
});

describe("cli scaffolder", () => {
  const originalArgv = process.argv;
  const originalCwd = process.cwd;
  let tmpDir: string;

  beforeEach(() => {
    // Create a temporary directory for the test
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "create-cli-test-"));
  });

  afterEach(() => {
    // Restore process.argv and process.cwd
    process.argv = originalArgv;
    process.cwd = originalCwd;

    // Clean up temporary directory
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
    expect(app.name).toBe("create-cli");
  });

  it("should scaffold a project when a target directory is provided", async () => {
    const projectName = "my-new-cli";
    const targetPath = path.join(tmpDir, projectName);

    // Mock process.cwd to return the temporary directory
    vi.spyOn(process, "cwd").mockReturnValue(tmpDir);

    // Spy on console.log
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Create gunshi command context, which mocks process.argv for us
    const ctx = await createCommandContext({
      positionals: ["node", "create-cli", projectName],
      argv: ["node", "create-cli", projectName],
    });

    await app.run(ctx);

    logSpy.mockRestore();

    // Verify files
    expect(fs.existsSync(targetPath), `Target directory ${targetPath} should exist`).toBe(true);
    expect(fs.existsSync(path.join(targetPath, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(targetPath, "README.md"))).toBe(true);
    expect(fs.existsSync(path.join(targetPath, ".gitignore"))).toBe(true);
    expect(fs.existsSync(path.join(targetPath, "src/cli.ts"))).toBe(true);

    // Verify template expansion
    const pkg = JSON.parse(fs.readFileSync(path.join(targetPath, "package.json"), "utf-8"));
    expect(pkg.name).toBe(projectName);
  });

  it("should scaffold a project using prompts when no argument is provided", async () => {
    // The mock prompt returns "prompt-app"
    const projectName = "prompt-app";
    const targetPath = path.join(tmpDir, projectName);

    // Mock process.cwd
    vi.spyOn(process, "cwd").mockReturnValue(tmpDir);

    // Spy on console.log
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Create gunshi command context, which mocks process.argv for us
    const ctx = await createCommandContext({
      argv: ["node", "create-cli"],
    });

    await app.run(ctx);

    logSpy.mockRestore();

    // Verify files
    expect(fs.existsSync(targetPath), `Target directory ${targetPath} should exist`).toBe(true);
    expect(fs.existsSync(path.join(targetPath, "package.json"))).toBe(true);

    const pkg = JSON.parse(fs.readFileSync(path.join(targetPath, "package.json"), "utf-8"));
    expect(pkg.name).toBe(projectName);
  });
});
