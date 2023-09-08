/* eslint-disable  @typescript-eslint/no-explicit-any */

export function recursivelyTransformToString(obj: any) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = recursivelyTransformToString(obj[key]) as any;
    }
  }

  if (typeof obj === "object") {
    for (const key in obj) {
      obj[key] = recursivelyTransformToString(obj[key]) as any;
    }

    return obj;
  } else {
    return String(obj);
  }
}
