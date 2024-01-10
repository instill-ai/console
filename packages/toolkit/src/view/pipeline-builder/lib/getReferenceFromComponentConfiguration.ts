import { GeneralRecord } from "../../../lib";
import { InstillReference } from "../type";
import { getReferencesFromString } from "./getReferencesFromString";

export function getReferenceFromComponentConfiguration(
  configuration: GeneralRecord
) {
  return getReferences(configuration);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
