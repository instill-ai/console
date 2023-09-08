import { GeneralRecord } from "pipeline-builder/type";
import { InstillAIOpenAPIProperty } from "./getPropertiesFromOpenAPISchema";
import { OpenAPIV3 } from "openapi-types";

export function composePipelineInputSnippet(
  properties: InstillAIOpenAPIProperty[]
) {
  const input: GeneralRecord = {};

  for (const property of properties) {
    if (!property.path) continue;

    if (property.type === "array") {
      if ((property.items as OpenAPIV3.SchemaObject).type === "string") {
        input[property.path] = [
          "Please put your first value here",
          "Please put your second value here",
          "...",
        ];
      } else if ((property.items as OpenAPIV3.SchemaObject).type === "number") {
        input[property.path] = [0, 1, 2];
      } else if (
        (property.items as OpenAPIV3.SchemaObject).type === "boolean"
      ) {
        input[property.path] = [true, false];
      }
    }
  }
}
