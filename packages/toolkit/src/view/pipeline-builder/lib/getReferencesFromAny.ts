/* eslint-disable @typescript-eslint/no-explicit-any */

import { InstillReference } from "../type";
import { getReferencesFromString } from "./getReferencesFromString";

export function getReferencesFromAny(value: any) {
  return getReferences(value);

  function getReferences(
    value: any,
    references: InstillReference[] = []
  ): InstillReference[] {
    if (Array.isArray(value)) {
      for (const item of value) {
        const refs = getReferences(item, references);
        return [...references, ...refs];
      }
    } else if (typeof value === "string") {
      const refs = getReferencesFromString(value);

      if (refs) {
        return [...references, ...refs];
      }
    } else if (typeof value === "object" && value !== null) {
      let refs = [...references];

      for (const nestedKey in value) {
        if (value[nestedKey] !== null) {
          refs = [...refs, ...getReferences(value[nestedKey])];
        }
      }

      return refs;
    }

    return references;
  }
}
