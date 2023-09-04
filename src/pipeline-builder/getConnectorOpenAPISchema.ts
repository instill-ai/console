import { Nullable, PipelineComponentType, Spec } from "@instill-ai/toolkit";
import { OpenAPIV3 } from "openapi-types";
import { PipelineConnectorComponent } from "./type";

export type GetConnectorOpenAPISchemaProps = {
  component: PipelineConnectorComponent;
};

export function getConnectorOpenAPISchema(
  props: GetConnectorOpenAPISchemaProps
) {
  const { component } = props;

  let inputSchema: Nullable<OpenAPIV3.SchemaObject> = null;
  let outputSchema: Nullable<OpenAPIV3.SchemaObject> = null;

  switch (component.type) {
    case "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN":
      // Because right now blockchain connector doesn't have complicate category, so backend use
      // "default" as its spec key
      inputSchema = (
        (
          (
            component?.definition?.spec.openapi_specifications.default.paths[
              "/execute"
            ]?.post?.requestBody as OpenAPIV3.RequestBodyObject
          ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
        ).properties?.inputs as OpenAPIV3.ArraySchemaObject
      ).items as OpenAPIV3.SchemaObject;
      outputSchema = (
        (
          (
            (
              component?.definition?.spec.openapi_specifications.default.paths[
                "/execute"
              ]?.post?.responses["200"] as OpenAPIV3.ResponseObject
            ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
          )["application/json"]?.schema as OpenAPIV3.SchemaObject
        ).properties?.outputs as OpenAPIV3.ArraySchemaObject
      ).items as OpenAPIV3.SchemaObject;
      break;
    case "COMPONENT_TYPE_CONNECTOR_AI":
      if (component.configuration.input.task) {
        inputSchema = (
          (
            (
              component?.definition?.spec.openapi_specifications[
                component.configuration.input.task
              ].paths["/execute"]?.post
                ?.requestBody as OpenAPIV3.RequestBodyObject
            ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
          ).properties?.inputs as OpenAPIV3.ArraySchemaObject
        ).items as OpenAPIV3.SchemaObject;
        outputSchema = (
          (
            (
              (
                component?.definition?.spec.openapi_specifications[
                  component.configuration.input.task
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
