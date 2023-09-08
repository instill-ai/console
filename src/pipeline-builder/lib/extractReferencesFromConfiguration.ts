import { Nullable } from "@instill-ai/toolkit";
import { extractPipelineComponentReferenceFromString } from "./extractPipelineComponentReferenceFromString";
import { GeneralRecord } from "pipeline-builder/type";

export type PipelineComponentReference =
  | DoubleCurlyBraceReference
  | SingleCurlyBraceReference;

export type DoubleCurlyBraceReference = {
  type: "doubleCurlyBrace";
  path: string;
  originalValue: string;
  referenceValues: ReferenceValueSet[];
  nodeId: Nullable<string>;
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
  nodeId: Nullable<string>;
};

export function extractReferencesFromConfiguration(
  configuration: GeneralRecord,
  nodeId: string,
  currentPath: string[] = []
) {
  const results: PipelineComponentReference[] = [];

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function getConfigurationReferences(key: string, value: any) {
    if (Array.isArray(value)) {
      for (const item of value) {
        getConfigurationReferences("", item);
      }
    } else if (typeof value === "string") {
      const reference = extractPipelineComponentReferenceFromString({
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
