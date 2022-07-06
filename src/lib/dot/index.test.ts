import dot from ".";

describe("getter", () => {
  const obj = {
    foo: {
      bar: "yes!",
    },
  };

  it("gets a value by array path", () => {
    expect(dot.getter(obj, ["foo", "bar"])).toBe("yes!");
  });

  it("gets a value by string path", () => {
    expect(dot.getter(obj, "foo.bar")).toBe("yes!");
  });

  it('return "undefined" if value was not found using given path', () => {
    expect(dot.getter(obj, "foo.aar")).toBeUndefined();
  });

  it("return defaultValue if value was not found using given path", () => {
    expect(dot.getter(obj, "foo.aar", "no!")).toBe("no!");
  });
});
