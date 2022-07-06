/* eslint-disable  @typescript-eslint/no-explicit-any */

export type DotKey = string | string[];

const getter = (obj: any, key: DotKey, defaultValue?: any): any => {
  const path = toPath(key);

  if (typeof obj === "undefined") return defaultValue;

  const firstKey = path.shift();

  if (!firstKey) return obj;

  return getter(obj[firstKey], path, defaultValue);

  // const path = toPath(key);
  // let num = 0;
  // while (obj && num < path.length) {
  //   obj = obj[path[num++]];
  // }
  // return obj === undefined ? defaultValue : obj;
};

// const setter = (key: string) => {};

export default {
  getter,
};

const toPath = (key: DotKey): string[] => {
  if (Array.isArray(key)) return key;
  return key.split(".");
};
