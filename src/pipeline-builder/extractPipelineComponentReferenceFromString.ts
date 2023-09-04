import { Nullable } from "@instill-ai/toolkit";
import { PipelineComponentReference } from "./extractReferencesFromConfiguration";

export function extractPipelineComponentReferenceFromString({
  key,
  value,
  nodeId,
  currentPath = [],
}: {
  value: string;
  nodeId: Nullable<string>;
  currentPath: string[];
  key: Nullable<string>;
}): Nullable<PipelineComponentReference> {
  if (!value) return null;

  const newPath = key ? [...currentPath, key] : currentPath;

  // get reference value in the double curly braces
  const doubleCurlyBracesRegex = /\{\{([^{}]+)\}\}/gm;
  const doubleCurlyBracesMatchs = value.match(doubleCurlyBracesRegex);
  if (!doubleCurlyBracesMatchs) {
    const singleCurlyBracesRegex = /\{([^{}]+)\}/gm;

    // Each value can only have one single curly braces reference
    const singleCurlyBracesMatchs = value.match(singleCurlyBracesRegex);
    if (singleCurlyBracesMatchs) {
      return {
        path: newPath.join("."),
        originalValue: value,
        referenceValue: {
          withoutCurlyBraces: singleCurlyBracesMatchs[0].slice(1, -1).trim(),
          withCurlyBraces: singleCurlyBracesMatchs[0],
        },
        nodeId,
        type: "singleCurlyBrace",
      };
    }
  } else {
    return {
      path: newPath.join("."),
      originalValue: value,
      referenceValues: doubleCurlyBracesMatchs.map((match) => ({
        withoutCurlyBraces: match.slice(2, -2).trim(),
        withCurlyBraces: match,
      })),
      nodeId,
      type: "doubleCurlyBrace",
    };
  }

  return null;
}
