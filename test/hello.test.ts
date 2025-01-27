import { myAdd } from "../src/my_number";

describe("add function", () => {
  it("returns 3", () => {
    expect(myAdd(1, 2)).toBe(3);
  });
  it("returns 5", () => {
    expect(myAdd(2, 3)).toBe(5);
  });
});
