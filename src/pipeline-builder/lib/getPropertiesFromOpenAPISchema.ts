import { OpenAPIV3 } from "openapi-types";

export type InstillAIOpenAPIProperty = OpenAPIV3.SchemaObject & {
  path?: string;
  instillFormat?: string;
};

export function getPropertiesFromOpenAPISchema(
  schema: OpenAPIV3.SchemaObject,
  parentKey?: string,
  title?: string,
  parentIsArray?: boolean
) {
  let properties: InstillAIOpenAPIProperty[] = [];

  if (schema.type === "object") {
    if (schema.properties) {
      Object.entries(schema.properties as OpenAPIV3.SchemaObject).map(
        ([key, value]) => {
          const parentKeyList = parentKey ? parentKey.split(".") : [];

          properties = [
            ...properties,
            ...getPropertiesFromOpenAPISchema(
              value,
              [...parentKeyList, key].join(".")
            ),
          ];
        }
      );
    }
  } else if (schema.type === "array") {
    properties = [
      ...properties,
      {
        ...schema,
        items: getPropertiesFromOpenAPISchema(
          schema.items as OpenAPIV3.SchemaObject,
          parentKey,
          schema.title,
          true
        ) as OpenAPIV3.ArraySchemaObject["items"],
        path: parentKey,
      },
    ];
  } else {
    if (parentIsArray) {
      properties.push(schema);
    } else {
      properties.push({
        path: parentKey,
        ...schema,
        title: title ? title : schema.title,
      });
    }
  }

  return properties;
}
