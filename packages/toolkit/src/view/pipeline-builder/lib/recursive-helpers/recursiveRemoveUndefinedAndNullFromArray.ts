/* eslint-disable  @typescript-eslint/no-explicit-any */

export function recursiveRemoveUndefinedAndNullFromArray(value: any) {
  if (typeof value === "object") {
    for (const key in value) {
      value[key] = recursiveRemoveUndefinedAndNullFromArray(value[key]) as any;
    }
  }

  if (Array.isArray(value)) {
    value = value.filter((item) => item !== undefined && item !== null);
  }

  return value;
}
