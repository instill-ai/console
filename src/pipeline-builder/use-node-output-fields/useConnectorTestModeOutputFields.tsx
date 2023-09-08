/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Nullable, TriggerUserPipelineResponse } from "@instill-ai/toolkit";
import {
  InstillAIOpenAPIProperty,
  getConnectorInputOutputSchema,
  getPropertiesFromOpenAPISchema,
} from "pipeline-builder/lib";
import * as React from "react";
import { TextField } from "./TextField";
import { TextsField } from "./TextsField";
import { ImageField } from "./ImageField";
import { ImagesField } from "./ImagesField";
import { PipelineConnectorComponent } from "pipeline-builder/type";
import { NumberField } from "./NumberField";
import { NumbersField } from "./NumbersField";
import { AudioField } from "./AudioField";
import { AudiosField } from "./AudiosType";

export function useConnectorTestModeOutputFields(
  component: PipelineConnectorComponent,
  traces: Nullable<TriggerUserPipelineResponse["metadata"]["traces"]>
) {
  const fields = React.useMemo(() => {
    let outputProperties: InstillAIOpenAPIProperty[] = [];
    const fields: React.ReactElement[] = [];

    if (!component) {
      return [];
    }

    const { outputSchema } = getConnectorInputOutputSchema(component);

    if (outputSchema) {
      outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
    }

    console.log(outputProperties, traces);

    const trace = traces ? traces[component.id] : null;

    for (const property of outputProperties) {
      const title = property.path ? property.path : property.title ?? null;

      let propertyValue: any = null;

      if (trace) {
        if (property.path) {
          propertyValue = trace.outputs[0][property.path];
        }
      }

      switch (property.instillFormat) {
        case "text": {
          fields.push(
            <TextField
              nodeType="connector"
              key={property.path}
              title={title}
              text={propertyValue}
            />
          );
          break;
        }
        case "text_array": {
          fields.push(
            <TextsField
              nodeType="connector"
              key={property.path}
              title={title}
              texts={propertyValue}
            />
          );
          break;
        }
        case "image": {
          fields.push(
            <ImageField
              nodeType="connector"
              key={property.path}
              title={title}
              image={propertyValue}
            />
          );
          break;
        }
        case "image_array": {
          fields.push(
            <ImagesField
              nodeType="connector"
              key={property.path}
              title={title}
              images={propertyValue}
            />
          );
          break;
        }
        case "number": {
          fields.push(
            <NumberField
              nodeType="connector"
              key={property.path}
              title={title}
              number={propertyValue}
            />
          );
          break;
        }
        case "number_array": {
          fields.push(
            <NumbersField
              nodeType="connector"
              key={property.path}
              title={title}
              numbers={propertyValue}
            />
          );
          break;
        }
        case "audio": {
          fields.push(
            <AudioField
              nodeType="connector"
              key={property.path}
              title={title}
              audio={propertyValue}
            />
          );
          break;
        }
        case "audio_array": {
          fields.push(
            <AudiosField
              nodeType="connector"
              key={property.path}
              title={title}
              audios={propertyValue}
            />
          );
          break;
        }
      }
    }

    return fields;
  }, [component, traces]);

  return fields;
}
