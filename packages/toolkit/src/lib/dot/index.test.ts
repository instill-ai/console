import { test, expect, describe } from "vitest";
import { dot } from ".";

describe("getter", () => {
  const obj = {
    foo: {
      bar: "yes!",
    },
  };

  test("gets a value by array path", () => {
    expect(dot.getter(obj, ["foo", "bar"])).toBe("yes!");
  });

  test("gets a value by string path", () => {
    expect(dot.getter(obj, "foo.bar")).toBe("yes!");
  });

  test('return "undefined" if value was not found using given path', () => {
    expect(dot.getter(obj, "foo.aar")).toBeUndefined();
  });

  test("return defaultValue if value was not found using given path", () => {
    expect(dot.getter(obj, "foo.aar", "no!")).toBe("no!");
  });
});

describe("setter", () => {
  test("sets empty object with number", () => {
    const obj = {};
    dot.setter(obj, "foo", 123);
    expect(obj).toStrictEqual({ foo: 123 });
  });

  test("sets empty object", () => {
    const obj = {};
    dot.setter(obj, "foo", "bar");
    expect(obj).toStrictEqual({ foo: "bar" });
  });

  test("sets flat value", () => {
    const obj = { foo: "bar" };
    dot.setter(obj, "flat", "value");
    expect(obj).toStrictEqual({ foo: "bar", flat: "value" });
  });

  test("removes flat value", () => {
    const obj = { foo: "bar" };
    dot.setter(obj, "foo", undefined);
    expect(obj).toStrictEqual({});
  });

  test("sets nested value", () => {
    const obj = { x: "y" };
    dot.setter(obj, "foo.bar", "hi");
    expect(obj).toStrictEqual({ x: "y", foo: { bar: "hi" } });
  });

  test("updates nested value", () => {
    const obj = { x: "y", foo: { bar: "a" } };
    dot.setter(obj, "foo.bar", "b");
    expect(obj).toStrictEqual({ x: "y", foo: { bar: "b" } });
  });

  test("removes nested value", () => {
    const obj = { x: "y", foo: { bar: "a" } };
    dot.setter(obj, "foo.bar", undefined);
    expect(obj).toStrictEqual({ x: "y", foo: {} });
    expect(Object.prototype.hasOwnProperty.call(obj.foo, "bar")).toBeFalsy();
  });

  test("updates deep nested value", () => {
    const obj = { x: "y", twofoldly: { foo: { bar: "a" } } };
    dot.setter(obj, "twofoldly.foo.bar", "b");
    expect(obj).toStrictEqual({ x: "y", twofoldly: { foo: { bar: "b" } } });
  });

  test("removes deep nested value", () => {
    const obj = { x: "y", twofoldly: { foo: { bar: "a" } } };
    dot.setter(obj, "twofoldly.foo.bar", undefined);
    expect(obj).toStrictEqual({ x: "y", twofoldly: { foo: {} } });
    expect(
      Object.prototype.hasOwnProperty.call(obj.twofoldly.foo, "bar")
    ).toBeFalsy();
  });

  test("sets new array", () => {
    const obj = { x: "y" };
    dot.setter(obj, "foo.0", "bar");
    expect(obj).toStrictEqual({ x: "y", foo: ["bar"] });
  });

  test("updates nested array value", () => {
    const obj = { x: "y", foo: ["bar"] };
    dot.setter(obj, "foo.0", "bar");
    expect(obj).toStrictEqual({ x: "y", foo: ["bar"] });
  });

  test("adds new item to nested array", () => {
    const obj = { x: "y", foo: ["bar"] };
    dot.setter(obj, "foo.1", "bar2");
    expect(obj).toStrictEqual({ x: "y", foo: ["bar", "bar2"] });
  });

  test("sticks to object with int key when defined", () => {
    const obj = { x: "y", foo: { 0: "a" } };
    dot.setter(obj, "foo.0", "b");
    expect(obj).toStrictEqual({ x: "y", foo: { 0: "b" } });
  });

  // We are currently don't support bracket path
  // eslint-disable-next-line vitest/no-commented-out-tests
  // it("supports bracket path", () => {
  //   const obj = { x: "y" };
  //   dot.setter(obj, "nested[0]", "value");
  //   expect(obj).toEqual({ x: "y", nested: ["value"] });
  // });

  test("supports path containing key of the object", () => {
    const obj = { x: "y" };
    dot.setter(obj, "a.x.c", "value");
    expect(obj).toStrictEqual({ x: "y", a: { x: { c: "value" } } });
  });

  test("can convert primitives to objects before setting", () => {
    const obj = { x: [{ y: true }] };
    dot.setter(obj, "x.0.y.z", true);
    expect(obj).toStrictEqual({ x: [{ y: { z: true } }] });
  });
});

describe("toDot", () => {
  test("can covert simple object to dot path object", () => {
    const obj = {
      foo: "hi",
      bar: "yo",
      fooBar: 123,
      test: {
        foo: "hi2",
        bar: "yo2",
      },
    };

    const dotObj = dot.toDot(obj);
    expect(dotObj).toStrictEqual({
      foo: "hi",
      bar: "yo",
      fooBar: 123,
      "test.foo": "hi2",
      "test.bar": "yo2",
    });
  });

  test("can conver nested object to dot path object", () => {
    const obj = {
      nested: {
        foo: {
          bar: 123,
          nested: {
            foo: "bar",
          },
        },
        hello: "how are you",
        good: null,
      },
    };
    const dotObj = dot.toDot(obj);
    expect(dotObj).toStrictEqual({
      "nested.foo.bar": 123,
      "nested.foo.nested.foo": "bar",
      "nested.hello": "how are you",
      "nested.good": null,
    });
  });
});
