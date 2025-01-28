import { describe, expect, it } from "vitest";
import { getTodosHandler } from "../src/server";

describe("getTodosHandler", () => {
  it("returns a dummy message", async () => {
    const res = getTodosHandler();
    const data = await res.json();
    expect(data).toEqual(["hello", "world"]);
  });
});
