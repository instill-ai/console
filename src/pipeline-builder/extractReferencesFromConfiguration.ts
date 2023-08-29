export type ConfigurationReference = {
  path: string;
  originalValue: string;
  referenceValue: string;
  nodeId: string;
};

export function extractReferencesFromConfiguration(
  configuration: Record<string, any>,
  nodeId: string,
  currentPath: string[] = []
) {
  const results: ConfigurationReference[] = [];

  function getConfigurationReferences(key: string, value: any) {
    if (Array.isArray(value)) {
      for (const item of value) {
        getConfigurationReferences("", item);
      }
    } else if (typeof value === "string") {
      results.push(
        ...extractReferenceFromString({ value, nodeId, currentPath, key })
      );
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
}) {
  const results: ConfigurationReference[] = [];
  const newPath = [...currentPath, key];

  // get reference value in the double curly braces
  const doubleCurlyBracesRegex = /\{\{([^{}]+)\}\}/gm;
  const doubleCurlyBracesMatchs = value.match(doubleCurlyBracesRegex);
  if (!doubleCurlyBracesMatchs) {
    const singleCurlyBracesRegex = /\{([^{}]+)\}/gm;
    const singleCurlyBracesMatchs = value.match(singleCurlyBracesRegex);
    if (singleCurlyBracesMatchs) {
      for (const match of singleCurlyBracesMatchs) {
        results.push({
          path: newPath.join("."),
          originalValue: value,
          referenceValue: match.slice(1, -1).trim(),
          nodeId,
        });
      }
    }
  } else {
    for (const match of doubleCurlyBracesMatchs) {
      results.push({
        path: newPath.join("."),
        originalValue: value,
        referenceValue: match.slice(2, -2).trim(),
        nodeId,
      });
    }
  }

  return results;
}
