/* eslint-disable  @typescript-eslint/no-explicit-any */

export type DotPath = string | string[];

/**
 * Get value with given path
 */

const getter = (obj: any, path: DotPath, defaultValue?: any): any => {
  path = toPath(path);
  let index = 0;
  while (obj && index < path.length) {
    obj = obj[path[index++]];
  }
  return obj === undefined ? defaultValue : obj;
};

/**
 * Set value with given path
 */

const setter = (obj: any, path: DotPath, value: any) => {
  if (!isObject) return obj;
  path = toPath(path);

  let index = -1;
  const length = path.length;
  const lastIndex = length - 1;
  let nested = obj;

  while (nested != null && ++index < length) {
    const key = path[index];
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = nested[key];
      newValue = isObject(objValue)
        ? objValue
        : isInteger(path[index + 1])
        ? []
        : {};
    }

    if (newValue === undefined) {
      delete nested[key];
    } else {
      nested[key] = newValue;
    }

    nested = nested[key];
  }
};

export default {
  getter,
  setter,
};

const toPath = (path: DotPath): string[] => {
  if (Array.isArray(path)) return path;
  return path.split(".");
};

/**
 * Checks if `value` is the object
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 */

const isObject = (value: any) => {
  const type = typeof value;
  return value !== null && (type === "object" || type === "function");
};

/**
 * Checks if `value` is the integer
 */

const isInteger = (value: any): boolean => {
  return String(Math.floor(Number(value))) === value;
};
