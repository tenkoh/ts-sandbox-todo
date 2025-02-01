import { describe, expect, it } from "vitest";
import type { TodoItem } from "../src/entity/todo";
import { getTodosHandler } from "../src/server";

describe("getTodosHandler", () => {
  it("return all todos", async () => {
    const srv = {
      getTodos(): TodoItem[] {
        return [
          {
            title: "title1",
            createdAt: new Date("2024-09-22T12:34:56+09:00"),
            status: "before",
          },
          {
            title: "title2",
            body: "body2",
            createdAt: new Date("2024-09-22T12:34:56+09:00"),
            status: "finished",
          },
        ];
      },
    };
    const res = getTodosHandler(srv)();
    const data = await res.json();
    const want = [
      {
        title: "title1",
        createdAt: "2024-09-22T03:34:56.000Z",
        status: "before",
      },
      {
        title: "title2",
        body: "body2",
        createdAt: "2024-09-22T03:34:56.000Z",
        status: "finished",
      },
    ];
    expect(data).toEqual(want);
  });
});
