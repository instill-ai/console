import * as React from "react";

import { Nullable } from "../../../type";
import { getReferencesFromString } from "../../../../view";
import { SmartHint } from "../../../use-smart-hint";
import { SmartHintWarning } from "../../type";

export function useValidateReferenceAndTemplate({
  hints,
  fieldValue,
  setSmartHintWarning,
}: {
  hints: SmartHint[];
  fieldValue: string;
  setSmartHintWarning: React.Dispatch<
    React.SetStateAction<Nullable<SmartHintWarning>>
  >;
}) {
  React.useEffect(() => {
    const notAvailableReferences: string[] = [];

    const references = getReferencesFromString(fieldValue);

    if (references.length > 0) {
      for (const reference of references) {
        if (
          !hints.find((hint) => {
            if (hint.path === reference.referenceValue.withoutCurlyBraces) {
              return true;
            }

            // We need to generate more fine grained objectArray hint
            if (
              reference.referenceValue.withoutCurlyBraces.includes(hint.path)
            ) {
              return true;
            }

            return false;
          })
        ) {
          notAvailableReferences.push(reference.referenceValue.withCurlyBraces);
        }
      }
    }

    if (notAvailableReferences.length > 0) {
      setSmartHintWarning({
        notAvailableReferences,
      });
    } else {
      setSmartHintWarning(null);
    }
  }, [fieldValue, hints, setSmartHintWarning]);
}
