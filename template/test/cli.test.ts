import { describe, it, expect, vi } from "vitest";

import { app } from "../src/cli.js";
import { hello } from "../src/commands/hello.js";

describe("cli", () => {
  it("should be defined", () => {
    expect(app).toBeDefined();
    expect(app.name).toBe("my-cli");
  });

  it("should run main command", () => {
    const consoleSpy = vi.spyOn(console, "log");
    // Mock context as needed for the run function
    app.run();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Welcome to create-cli! Run with --help to see commands.",
    );
    consoleSpy.mockRestore();
  });
});

describe("hello command", () => {
  it("should be defined", () => {
    expect(hello).toBeDefined();
    expect(hello.name).toBe("hello");
  });

  it("should run hello command", () => {
    const consoleSpy = vi.spyOn(console, "log");
    // Mock context with values
    hello.run({ values: { name: "Test" } } as any);
    expect(consoleSpy).toHaveBeenCalledWith("Hello, Test!");
    consoleSpy.mockRestore();
  });
});
