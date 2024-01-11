/* eslint-disable  @typescript-eslint/no-explicit-any */

export function recursiveParseNumberToString(value: any) {
  if (value === null || value === undefined) {
    return value;
  }

  // We directly allow boolean values, because boolean values
  // can't be written in referernce syntax right now
  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const key in value) {
      value[key] = recursiveParseNumberToString(value[key]) as any;
    }
    return value;
  }

  if (typeof value === "object") {
    for (const key in value) {
      value[key] = recursiveParseNumberToString(value[key]) as any;
    }

    return value;
  }

  if (typeof value !== "number") {
    return value;
  }

  return String(value);
}
