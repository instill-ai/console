import { Nullable, TriggerUserPipelineResponse } from "@instill-ai/toolkit";
import { OpenAPIV3 } from "openapi-types";
import {
  InstillAIOpenAPIProperty,
  getPropertiesFromOpenAPISchema,
} from "pipeline-builder/lib";
import { getPipelineInputOutputSchema } from "pipeline-builder/lib/getPipelineInputOutputSchema";
import * as React from "react";
import { TextField } from "./TextField";
import { TextsField } from "./TextsField";
import { ImageField } from "./ImageField";
import { ImagesField } from "./ImagesField";

export function useEndOperatorTestModeOutputFields(
  pipelineOpenAPISchema: Nullable<OpenAPIV3.Document>,
  outputs: TriggerUserPipelineResponse["outputs"]
) {
  const fields = React.useMemo(() => {
    let outputProperties: InstillAIOpenAPIProperty[] = [];
    const fields: React.ReactElement[] = [];

    if (!pipelineOpenAPISchema) {
      return [];
    }

    const { outputSchema } = getPipelineInputOutputSchema(
      pipelineOpenAPISchema
    );

    if (outputSchema) {
      outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
    }

    for (const property of outputProperties) {
      let value: any = null;
      const title = property.title ? property.title : property.path ?? null;

      if (outputs[0]) {
        value = property.path ? outputs[0][property.path] : null;
      }

      switch (property.instillFormat) {
        case "text": {
          fields.push(
            <TextField key={property.path} title={title} text={value} />
          );
          break;
        }
        case "text_array": {
          fields.push(
            <TextsField key={property.path} title={title} texts={value} />
          );
          break;
        }
        case "image": {
          fields.push(
            <ImageField key={property.path} title={title} image={value} />
          );
          break;
        }
        case "image_array": {
          fields.push(
            <ImagesField key={property.path} title={title} images={value} />
          );
          break;
        }
      }
    }

    return fields;
  }, [pipelineOpenAPISchema, outputs]);

  return fields;
}
