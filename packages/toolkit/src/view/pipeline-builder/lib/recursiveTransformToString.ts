/* eslint-disable  @typescript-eslint/no-explicit-any */

export function recursiveTransformToString(obj: any) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // We directly allow boolean values, because boolean values
  // can't be written in referernce syntax right now
  if (typeof obj === "boolean") {
    return obj;
  }

  if (Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = recursiveTransformToString(obj[key]) as any;
    }
  }

  if (typeof obj === "object") {
    for (const key in obj) {
      obj[key] = recursiveTransformToString(obj[key]) as any;
    }

    return obj;
  } else {
    return String(obj);
  }
}
