import { InstillReference, ReferenceValueSet } from "../type";

export function getReferencesFromString(value: string): InstillReference[] {
  const dollarBraceReferences: InstillReference[] = [];
  const dollarBraceRegex = /\$\{\s*([^}\s]+)\s*\}/gm;
  const dollarBraceMatches = String(value).match(dollarBraceRegex);

  if (dollarBraceMatches) {
    for (const match of dollarBraceMatches) {
      dollarBraceReferences.push({
        originalValue: match,
        referenceValue: {
          withCurlyBraces: match,
          withoutCurlyBraces: match.slice(2, -1).trim(),
        },
      });
    }
  }

  return dollarBraceReferences;
}
