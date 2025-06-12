"use client";

/**
 * Reference: https://github.com/ajv-validator/ajv/issues/763#issuecomment-1724751308
 */

// There is very weird window is not found error happening if we import the
// monaco-editor whole namespace
import type { editor } from "monaco-editor";
import Ajv from "ajv";
import YAML from "yaml";

import { GeneralRecord, Nullable } from "../../../lib";
import { InstillYamlSchema } from "./schema";

const ajv = new Ajv({ allErrors: true });

type ValidateReturn =
  | {
      success: true;
      data: GeneralRecord;
    }
  | {
      success: false;
      markers: editor.IMarkerData[];
    };

export enum MarkerSeverity {
  Hint = 1,
  Info = 2,
  Warning = 4,
  Error = 8,
}

export function validateVSCodeYaml(
  recipe: string,
  skipInstillFormatCheck = false,
): ValidateReturn {
  // SourceMap will index the lines of the YAML file using properties paths as keys
  const markers: editor.IMarkerData[] = [];

  let yamlData: Nullable<GeneralRecord> = null;

  try {
    yamlData = YAML.parse(recipe);
  } catch (error) {
    if (error instanceof YAML.YAMLError) {
      if (error.linePos && error.linePos.length > 0) {
        markers.push({
          startLineNumber: error.linePos[0].line,
          startColumn: error.linePos[0].col,
          endLineNumber: error.linePos[0].line,
          endColumn: error.linePos[0].col,
          message: error.message,
          severity: MarkerSeverity.Error,
        });
      }
    }

    return { success: false, markers };
  }

  if (!yamlData) {
    return { success: false, markers };
  }

  const lineCounter = new YAML.LineCounter();

  const doc = YAML.parseAllDocuments<YAML.YAMLMap>(recipe, { lineCounter });

  if (!doc || !doc[0]) {
    return {
      success: false,
      markers: [],
    };
  }

  if (skipInstillFormatCheck) {
    return { success: true, data: yamlData };
  }

  try {
    const validator = ajv.compile(InstillYamlSchema);

    validator(yamlData);

    if (validator.errors) {
      for (const error of validator.errors) {
        const propertyPath: string = error.instancePath
          .replace(/^\//, "")
          .replace(/\//g, ".");

        const node = doc[0].getIn(propertyPath.split("."), true) as YAML.Node;

        if (node && node.range) {
          const pos = lineCounter.linePos(node.range[0]);
          const adjustedLine =
            node instanceof YAML.Scalar ? pos.line : pos.line - 1;

          markers.push({
            startLineNumber: adjustedLine,
            startColumn: pos.col,
            endLineNumber: adjustedLine,
            endColumn: pos.col,
            message: error.message || "Unknown error",
            severity: MarkerSeverity.Error,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  if (markers.length === 0) {
    return { success: true, data: yamlData };
  } else {
    return { success: false, markers };
  }
}
