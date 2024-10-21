/* eslint-disable @typescript-eslint/no-explicit-any */

import { InstillReference } from "../type";
import { getReferencesFromString } from "./getReferencesFromString";

export function getReferencesFromAny(value: any) {
  return getReferences(value);

  function getReferences(
    value: any,
    references: InstillReference[] = [],
  ): InstillReference[] {
    if (Array.isArray(value)) {
      const refs = [...references];
      for (const item of value) {
        const itemRefs = getReferences(item, references);
        refs.push(...itemRefs);
      }
      return refs;
    } else if (typeof value === "string") {
      const refs = getReferencesFromString(value);

      if (refs) {
        return [...references, ...refs];
      }
    } else if (typeof value === "object" && value !== null) {
      const refs = [...references];

      for (const nestedKey in value) {
        if (value[nestedKey] !== null) {
          refs.push(...getReferences(value[nestedKey]));
        }
      }

      return refs;
    }

    return references;
  }
}
