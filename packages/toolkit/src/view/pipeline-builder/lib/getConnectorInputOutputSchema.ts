import { OpenAPIV3 } from "openapi-types";
import { Nullable, PipelineConnectorComponent } from "../../../lib";
import { JSONSchema7 } from "json-schema";

export function getConnectorInputOutputSchema(
  component: PipelineConnectorComponent
) {
  let inputSchema: Nullable<OpenAPIV3.SchemaObject> = null;
  let outputSchema: Nullable<OpenAPIV3.SchemaObject> = null;

  if (!component.connector_definition) {
    return { outputSchema, inputSchema };
  }

  switch (component.type) {
    case "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN":
    case "COMPONENT_TYPE_CONNECTOR_DATA":
      // Because right now blockchain connector doesn't have complicate category, so backend use
      // "default" as its spec key

      // If the component has task field in its component_configuration, it means it has complicate category
      // The <default> category will be replaces with the task in the component_configuration

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
        ).items as OpenAPIV3.SchemaObject;
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
        ).items as OpenAPIV3.SchemaObject;
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
        ).items as OpenAPIV3.SchemaObject;
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
        ).items as OpenAPIV3.SchemaObject;
      }

      break;

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
        ).items as OpenAPIV3.SchemaObject;
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
        ).items as OpenAPIV3.SchemaObject;
      }
      break;
  }

  return { outputSchema, inputSchema };
}

function checkHasTaskField(schema: JSONSchema7) {
  const oneOf = schema.oneOf as JSONSchema7[];

  if (!oneOf) {
    return false;
  }

  const hasTaskField = oneOf.some((schema) => {
    return schema.properties?.task;
  });

  return hasTaskField;
}
