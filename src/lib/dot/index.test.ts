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

describe("setter", () => {
  it("sets empty object", () => {
    const obj = {};
    dot.setter(obj, "foo", "bar");
    expect(obj).toEqual({ foo: "bar" });
  });

  it("sets flat value", () => {
    const obj = { foo: "bar" };
    dot.setter(obj, "flat", "value");
    expect(obj).toEqual({ foo: "bar", flat: "value" });
  });

  it("removes flat value", () => {
    const obj = { foo: "bar" };
    dot.setter(obj, "foo", undefined);
    expect(obj).toEqual({});
  });

  it("sets nested value", () => {
    const obj = { x: "y" };
    dot.setter(obj, "foo.bar", "hi");
    expect(obj).toEqual({ x: "y", foo: { bar: "hi" } });
  });

  it("updates nested value", () => {
    const obj = { x: "y", foo: { bar: "a" } };
    dot.setter(obj, "foo.bar", "b");
    expect(obj).toEqual({ x: "y", foo: { bar: "b" } });
  });

  it("removes nested value", () => {
    const obj = { x: "y", foo: { bar: "a" } };
    dot.setter(obj, "foo.bar", undefined);
    expect(obj).toEqual({ x: "y", foo: {} });
    expect(obj.foo).not.toHaveProperty("bar");
  });

  it("updates deep nested value", () => {
    const obj = { x: "y", twofoldly: { foo: { bar: "a" } } };
    dot.setter(obj, "twofoldly.foo.bar", "b");
    expect(obj).toEqual({ x: "y", twofoldly: { foo: { bar: "b" } } });
  });

  it("removes deep nested value", () => {
    const obj = { x: "y", twofoldly: { foo: { bar: "a" } } };
    dot.setter(obj, "twofoldly.foo.bar", undefined);
    expect(obj).toEqual({ x: "y", twofoldly: { foo: {} } });
    expect(obj.twofoldly.foo).not.toHaveProperty("bar");
  });

  it("sets new array", () => {
    const obj = { x: "y" };
    dot.setter(obj, "foo.0", "bar");
    expect(obj).toEqual({ x: "y", foo: ["bar"] });
  });

  it("updates nested array value", () => {
    const obj = { x: "y", foo: ["bar"] };
    dot.setter(obj, "foo.0", "bar");
    expect(obj).toEqual({ x: "y", foo: ["bar"] });
  });

  it("adds new item to nested array", () => {
    const obj = { x: "y", foo: ["bar"] };
    dot.setter(obj, "foo.1", "bar2");
    expect(obj).toEqual({ x: "y", foo: ["bar", "bar2"] });
  });

  it("sticks to object with int key when defined", () => {
    const obj = { x: "y", foo: { 0: "a" } };
    dot.setter(obj, "foo.0", "b");
    expect(obj).toEqual({ x: "y", foo: { 0: "b" } });
  });

  // We are currently don't support bracket path

  // it("supports bracket path", () => {
  //   const obj = { x: "y" };
  //   dot.setter(obj, "nested[0]", "value");
  //   expect(obj).toEqual({ x: "y", nested: ["value"] });
  // });

  it("supports path containing key of the object", () => {
    const obj = { x: "y" };
    dot.setter(obj, "a.x.c", "value");
    expect(obj).toEqual({ x: "y", a: { x: { c: "value" } } });
  });

  it("can convert primitives to objects before setting", () => {
    const obj = { x: [{ y: true }] };
    dot.setter(obj, "x.0.y.z", true);
    expect(obj).toEqual({ x: [{ y: { z: true } }] });
  });
});
