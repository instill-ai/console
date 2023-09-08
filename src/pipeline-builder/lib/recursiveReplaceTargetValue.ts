/* eslint-disable  @typescript-eslint/no-explicit-any */

export function recursiveReplaceTargetValue(
  value: any,
  targetValue: any,
  replacement: any
) {
  if (typeof value === "object") {
    for (const key in value) {
      value[key] = recursiveReplaceTargetValue(
        value[key],
        targetValue,
        replacement
      );
    }
  }

  if (Array.isArray(value)) {
    for (const key in value) {
      value[key] = recursiveReplaceTargetValue(
        value[key],
        targetValue,
        replacement
      );
    }
  }

  if (value === targetValue) {
    return replacement;
  } else {
    return value;
  }
}
