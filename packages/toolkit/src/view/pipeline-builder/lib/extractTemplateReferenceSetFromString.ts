import { ReferenceValueSet } from "../type";

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
  let subsituteValue = String(value);

  const doubleCurlyBracesRegex = /\{\{([^{}]+)\}\}/gm;
  const doubleCurlyBracesMatchs = String(value).match(doubleCurlyBracesRegex);

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
      subsituteValue = subsituteValue.replaceAll(match, "");
    }
  }

  const singleCurlyBracesRegex = /\{([^{}]+)\}/gm;
  const singleCurlyBracesMatchs = subsituteValue.match(singleCurlyBracesRegex);

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
