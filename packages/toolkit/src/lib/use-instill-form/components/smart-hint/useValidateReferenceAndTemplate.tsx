import * as React from "react";

import { Nullable } from "../../../type";
import { extractTemplateReferenceSetFromString } from "../../../../view";
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
    const notAvailableTemplates: string[] = [];

    const templateReferenceSet =
      extractTemplateReferenceSetFromString(fieldValue);

    if (templateReferenceSet.doubleCurlyBrace.count > 0) {
      for (const template of templateReferenceSet.doubleCurlyBrace.references) {
        if (
          !hints.find(
            (hint) => hint.path === template.referenceValue.withoutCurlyBraces
          )
        ) {
          notAvailableTemplates.push(template.referenceValue.withCurlyBraces);
        }
      }
    }

    if (templateReferenceSet.singleCurlyBrace.count > 0) {
      for (const reference of templateReferenceSet.singleCurlyBrace
        .references) {
        if (
          !hints.find(
            (hint) => hint.path === reference.referenceValue.withoutCurlyBraces
          )
        ) {
          notAvailableReferences.push(reference.referenceValue.withCurlyBraces);
        }
      }
    }

    if (notAvailableReferences.length > 0 || notAvailableTemplates.length > 0) {
      setSmartHintWarning({
        notAvailableReferences,
        notAvailableTemplates,
      });
    } else {
      setSmartHintWarning(null);
    }
  }, [fieldValue, hints]);
}
