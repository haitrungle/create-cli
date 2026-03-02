import { describe, it, expect } from "vitest";

import { app } from "../src/cli.js";

describe("cli", () => {
  it("should be defined", () => {
    expect(app).toBeDefined();
    expect(app.name).toBe("create-cli");
  });
});
