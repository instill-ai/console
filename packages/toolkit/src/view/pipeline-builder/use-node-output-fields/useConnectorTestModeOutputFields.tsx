/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as React from "react";
import { TextField } from "./TextField";
import { TextsField } from "./TextsField";
import { ImageField } from "./ImageField";
import { ImagesField } from "./ImagesField";
import { NumberField } from "./NumberField";
import { NumbersField } from "./NumbersField";
import { AudioField } from "./AudioField";
import { AudiosField } from "./AudiosField";
import {
  Nullable,
  PipelineConnectorComponent,
  PipelineTrace,
  TriggerUserPipelineResponse,
} from "../../../lib";
import {
  InstillAIOpenAPIProperty,
  getConnectorInputOutputSchema,
  getPropertiesFromOpenAPISchema,
} from "../lib";
import { ObjectField } from "./ObjectField";
import { ObjectsField } from "./ObjectsField";

export function useConnectorTestModeOutputFields(
  component: PipelineConnectorComponent,
  traces: Nullable<TriggerUserPipelineResponse["metadata"]["traces"]>
) {
  const fields = React.useMemo(() => {
    let outputProperties: InstillAIOpenAPIProperty[] = [];

    if (!component) {
      return [];
    }

    const { outputSchema } = getConnectorInputOutputSchema(component);

    if (outputSchema) {
      outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
    }

    const trace = traces ? traces[component.id] : null;

    const fields = getOutputFieldComponent({
      properties: outputProperties,
      trace,
    });

    return fields;
  }, [component, traces]);

  return fields;
}

function getOutputFieldComponent({
  properties,
  trace,
}: {
  properties: InstillAIOpenAPIProperty[];
  trace: Nullable<PipelineTrace>;
}): React.ReactElement[] {
  const fields: React.ReactElement[] = [];

  for (const property of properties) {
    const title = property.path ? property.path : property.title ?? null;

    let propertyValue: any = null;

    if (property.type === "array" && !property.instillFormat) {
      fields.push(
        ...getOutputFieldComponent({
          properties: property.items as InstillAIOpenAPIProperty[],
          trace,
        })
      );
    }

    if (trace) {
      if (property.path) {
        propertyValue = trace.outputs[0][property.path];
      }
    }

    switch (property.instillFormat) {
      case "text": {
        fields.push(
          <TextField nodeType="connector" title={title} text={propertyValue} />
        );
        break;
      }
      case "text_array": {
        fields.push(
          <TextsField
            nodeType="connector"
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
            title={title}
            audios={propertyValue}
          />
        );
        break;
      }
      case "object": {
        fields.push(
          <ObjectField
            nodeType="connector"
            title={title}
            object={propertyValue}
          />
        );
        break;
      }
      case "object_array": {
        fields.push(
          <ObjectsField
            nodeType="connector"
            title={title}
            objects={propertyValue}
          />
        );
        break;
      }
    }
  }

  return fields;
}
