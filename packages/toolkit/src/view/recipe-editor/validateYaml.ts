/**
 * Reference: https://github.com/ajv-validator/ajv/issues/763#issuecomment-1724751308
 */

import { Diagnostic } from "@codemirror/lint";
import Ajv from "ajv";
import yaml from "js-yaml";
import SourceMap from "js-yaml-source-map";

import { InstillYamlSchema } from "./schema";

const ajv = new Ajv({ allErrors: true });

type SourceLocation = {
  line: number;
  column: number;
  position: number;
};

export function validateYaml(recipe: string) {
  // SourceMap will index the lines of the YAML file using properties paths as keys
  const yamlSourceMap: SourceMap = new SourceMap();
  const diagnostics: Diagnostic[] = [];

  try {
    const yamlData = yaml.load(recipe, {
      listener: yamlSourceMap.listen(),
    });

    const validator = ajv.compile(InstillYamlSchema);

    validator(yamlData);

    if (validator.errors) {
      for (const error of validator.errors) {
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
          const additionalPropertyLineNumber: string =
            additionalPropertyLocation
              ? additionalPropertyLocation.line.toString()
              : "unknown";

          if (additionalPropertyLocation) {
            diagnostics.push({
              from: additionalPropertyLocation.position,
              to: additionalPropertyLocation.position,
              message: `Property '${propertyPath}' has an additional property '${error.params.additionalProperty}' on line ${additionalPropertyLineNumber}`,
              severity: "error",
            });
          }
        } else {
          if (propertyLocation) {
            diagnostics.push({
              from: propertyLocation.position,
              to: propertyLocation.position,
              message: `Property '${propertyPath}' ${error.message}`,
              severity: "error",
            });
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      diagnostics.push({
        from: error.mark.position,
        to: error.mark.position,
        message: error.message,
        severity: "error",
      });
    }
  }
  return diagnostics;
}
