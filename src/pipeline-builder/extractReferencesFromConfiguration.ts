import { Nullable } from "@instill-ai/toolkit";

export type PipelineComponentReference =
  | DoubleCurlyBraceReference
  | SingleCurlyBraceReference;

export type DoubleCurlyBraceReference = {
  type: "doubleCurlyBrace";
  path: string;
  originalValue: string;
  referenceValues: ReferenceValueSet[];
  nodeId: string;
};

export type ReferenceValueSet = {
  withoutCurlyBraces: string;
  withCurlyBraces: string;
};

export type SingleCurlyBraceReference = {
  type: "singleCurlyBrace";
  path: string;
  originalValue: string;
  referenceValue: ReferenceValueSet;
  nodeId: string;
};

export function extractReferencesFromConfiguration(
  configuration: Record<string, any>,
  nodeId: string,
  currentPath: string[] = []
) {
  const results: PipelineComponentReference[] = [];

  function getConfigurationReferences(key: string, value: any) {
    if (Array.isArray(value)) {
      for (const item of value) {
        getConfigurationReferences("", item);
      }
    } else if (typeof value === "string") {
      const reference = extractReferenceFromString({
        value,
        nodeId,
        currentPath,
        key,
      });
      if (reference) {
        results.push(reference);
      }
    } else if (typeof value === "object" && value !== null) {
      for (const nestedKey in value) {
        if (value[nestedKey] !== null)
          getConfigurationReferences(nestedKey, value[nestedKey]);
      }
    }
  }

  getConfigurationReferences(nodeId, configuration);

  return results;
}

export function extractReferenceFromString({
  key,
  value,
  nodeId,
  currentPath = [],
}: {
  value: string;
  nodeId: string;
  currentPath: string[];
  key?: string;
}): Nullable<PipelineComponentReference> {
  if (!value) return null;

  const newPath = [...currentPath, key];

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
