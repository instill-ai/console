"use client";

/**
 * Reference: https://github.com/ajv-validator/ajv/issues/763#issuecomment-1724751308
 */

// There is very weird window is not found error happening if we import the
// monaco-editor whole namespace
import type { editor } from "monaco-editor";
import Ajv from "ajv";
import yaml from "js-yaml";
import SourceMap from "js-yaml-source-map";

import { GeneralRecord, Nullable } from "../../lib";
import { InstillYamlSchema } from "./schema";

const ajv = new Ajv({ allErrors: true });

type SourceLocation = {
  line: number;
  column: number;
  position: number;
};

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
  const yamlSourceMap: SourceMap = new SourceMap();
  const markers: editor.IMarkerData[] = [];

  let yamlData: Nullable<GeneralRecord> = null;

  try {
    yamlData = yaml.load(recipe, {
      listener: yamlSourceMap.listen(),
    }) as GeneralRecord;
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      markers.push({
        startLineNumber: error.mark.line,
        startColumn: error.mark.column,
        endLineNumber: error.mark.line,
        endColumn: error.mark.column,
        message: error.message,
        severity: MarkerSeverity.Error,
      });
    }
  }

  if (!yamlData || skipInstillFormatCheck) {
    return { success: false, markers };
  }

  try {
    const validator = ajv.compile(InstillYamlSchema);

    validator(yamlData);

    if (validator.errors) {
      for (const error of validator.errors) {
        if (error instanceof yaml.YAMLException) {
          console.log(error);
        }
        const propertyPath: string = error.instancePath
          .replace(/^\//, "")
          .replace(/\//g, ".");
        const propertyLocation: SourceLocation | undefined =
          yamlSourceMap.lookup(propertyPath);
        // const propertyLineNumber: string = propertyLocation
        //   ? propertyLocation.line.toString()
        //   : "unknown";

        if (error.keyword === "additionalProperties") {
          const additionalPropertyPath = `${propertyPath}.${error.params.additionalProperty}`;
          const additionalPropertyLocation: SourceLocation | undefined =
            yamlSourceMap.lookup(additionalPropertyPath);
          // const additionalPropertyLineNumber: string =
          //   additionalPropertyLocation
          //     ? additionalPropertyLocation.line.toString()
          //     : "unknown";

          if (additionalPropertyLocation) {
            markers.push({
              startLineNumber: additionalPropertyLocation.line,
              startColumn: additionalPropertyLocation.column,
              endLineNumber: additionalPropertyLocation.line,
              endColumn: additionalPropertyLocation.column,
              message: `Property '${additionalPropertyPath}' ${error.message}`,
              severity: MarkerSeverity.Error,
            });
          }
        } else {
          if (propertyLocation) {
            markers.push({
              startLineNumber: propertyLocation.line,
              startColumn: propertyLocation.column,
              endLineNumber: propertyLocation.line,
              endColumn: propertyLocation.column,
              message: `Property '${propertyPath}' ${error.message}`,
              severity: MarkerSeverity.Error,
            });
          }
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
