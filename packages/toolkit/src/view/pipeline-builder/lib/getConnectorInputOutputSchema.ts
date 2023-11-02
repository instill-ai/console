import { OpenAPIV3 } from "openapi-types";
import {
  InstillJSONSchema,
  Nullable,
  PipelineConnectorComponent,
} from "../../../lib";
import { JSONSchema7 } from "json-schema";

export function getConnectorInputOutputSchema(
  component: PipelineConnectorComponent
) {
  let inputSchema: Nullable<InstillJSONSchema> = null;
  let outputSchema: Nullable<InstillJSONSchema> = null;

  // Sometime the component don't have complete data (Like the response of mutating the pipeline)
  if (!component.connector_definition) {
    return { outputSchema, inputSchema };
  }

  // Additional guard
  if (!component.configuration) {
    return { outputSchema, inputSchema };
  }

  switch (component.type) {
    case "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN":
    case "COMPONENT_TYPE_CONNECTOR_DATA":
    case "COMPONENT_TYPE_CONNECTOR_AI":
      if (component.configuration.task) {
        inputSchema = (
          (
            (
              component?.connector_definition?.spec.openapi_specifications[
                component.configuration.task
              ].paths["/execute"]?.post
                ?.requestBody as OpenAPIV3.RequestBodyObject
            ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
          ).properties?.inputs as OpenAPIV3.ArraySchemaObject
        ).items as InstillJSONSchema;
        outputSchema = (
          (
            (
              (
                component?.connector_definition?.spec.openapi_specifications[
                  component.configuration.task
                ].paths["/execute"]?.post?.responses[
                  "200"
                ] as OpenAPIV3.ResponseObject
              ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
            )["application/json"]?.schema as OpenAPIV3.SchemaObject
          ).properties?.outputs as OpenAPIV3.ArraySchemaObject
        ).items as InstillJSONSchema;
      } else if (
        component.connector_definition.spec.component_specification.oneOf &&
        component.connector_definition.spec.component_specification.oneOf
          .length > 0
      ) {
        const defaultTask =
          ((
            (
              component.connector_definition.spec.component_specification
                .oneOf[0] as JSONSchema7
            )?.properties?.task as JSONSchema7
          )?.const as string) ?? null;

        if (!defaultTask) {
          return { outputSchema, inputSchema };
        }

        inputSchema = (
          (
            (
              component?.connector_definition?.spec.openapi_specifications[
                defaultTask
              ].paths["/execute"]?.post
                ?.requestBody as OpenAPIV3.RequestBodyObject
            ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
          ).properties?.inputs as OpenAPIV3.ArraySchemaObject
        ).items as InstillJSONSchema;
        outputSchema = (
          (
            (
              (
                component?.connector_definition?.spec.openapi_specifications[
                  defaultTask
                ].paths["/execute"]?.post?.responses[
                  "200"
                ] as OpenAPIV3.ResponseObject
              ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
            )["application/json"]?.schema as OpenAPIV3.SchemaObject
          ).properties?.outputs as OpenAPIV3.ArraySchemaObject
        ).items as InstillJSONSchema;
      }

      break;
  }

  return { outputSchema, inputSchema };
}
