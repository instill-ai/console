import { GeneralRecord } from "../type";

export function recursivelyCheckObjectHasValue(obj: GeneralRecord) {
  let hasValue = false;

  if (!obj) {
    return false;
  }

  for (const [, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      hasValue = true;
    }

    if (typeof value === "object") {
      if (recursivelyCheckObjectHasValue(value)) {
        hasValue = true;
      }
    } else {
      if (value) {
        hasValue = true;
      }

      if (value === null) {
        hasValue = true;
      }

      if (value === 0) {
        hasValue = true;
      }

      if (value === false) {
        hasValue = true;
      }
    }
  }

  return hasValue;
}
