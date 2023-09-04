import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { ReferenceValueSet } from "./extractReferencesFromConfiguration";

export type TemplateReference = {
  originalValue: string;
  referenceValue: ReferenceValueSet;
};

export type TemplateReferenceSet = {
  doubleCurlyBrace: {
    references: TemplateReference[];
    count: number;
  };
  singleCurlyBrace: {
    references: TemplateReference[];
    count: number;
  };
};

export function extractTemplateReferenceSetFromString(
  value: string
): TemplateReferenceSet {
  let singleCurlyBraceReferenceCount = 0;
  const singleCurlyBraceReferences: TemplateReference[] = [];
  let doubleCurlyBraceReferenceCount = 0;
  const doubleCurlyBraceReferences: TemplateReference[] = [];

  const doubleCurlyBracesRegex = /\{\{([^{}]+)\}\}/gm;
  const doubleCurlyBracesMatchs = value.match(doubleCurlyBracesRegex);

  if (doubleCurlyBracesMatchs) {
    for (const match of doubleCurlyBracesMatchs) {
      doubleCurlyBraceReferences.push({
        originalValue: match,
        referenceValue: {
          withCurlyBraces: match,
          withoutCurlyBraces: match.slice(2, -2).trim(),
        },
      });
      doubleCurlyBraceReferenceCount++;
    }
  }

  const singleCurlyBracesRegex = /\{([^{}]+)\}/gm;
  const singleCurlyBracesMatchs = value.match(singleCurlyBracesRegex);

  if (singleCurlyBracesMatchs) {
    for (const match of singleCurlyBracesMatchs) {
      singleCurlyBraceReferences.push({
        originalValue: match,
        referenceValue: {
          withCurlyBraces: match,
          withoutCurlyBraces: match.slice(1, -1).trim(),
        },
      });
      singleCurlyBraceReferenceCount++;
    }
  }

  return {
    doubleCurlyBrace: {
      references: doubleCurlyBraceReferences,
      count: doubleCurlyBraceReferenceCount,
    },
    singleCurlyBrace: {
      references: singleCurlyBraceReferences,
      count: singleCurlyBraceReferenceCount,
    },
  };
}
