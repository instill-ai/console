import { OpenAPIV3 } from "openapi-types";
import { InstillJSONSchema, Nullable } from "../../../lib";

export function getPipelineInputOutputSchema(
  schema: Nullable<OpenAPIV3.Document>
) {
  let inputSchema: Nullable<InstillJSONSchema> = null;
  let outputSchema: Nullable<InstillJSONSchema> = null;

  if (!schema) {
    return { outputSchema, inputSchema };
  }

  inputSchema = (
    (
      (
        schema.paths["/trigger"]?.post
          ?.requestBody as OpenAPIV3.RequestBodyObject
      ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
    ).properties?.inputs as OpenAPIV3.ArraySchemaObject
  ).items as InstillJSONSchema;

  outputSchema = (
    (
      (
        (
          schema.paths["/trigger"]?.post?.responses[
            "200"
          ] as OpenAPIV3.ResponseObject
        ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
      )["application/json"]?.schema as OpenAPIV3.SchemaObject
    ).properties?.outputs as OpenAPIV3.ArraySchemaObject
  ).items as InstillJSONSchema;

  return { outputSchema, inputSchema };
}
