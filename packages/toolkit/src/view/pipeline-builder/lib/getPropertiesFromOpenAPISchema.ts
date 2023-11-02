import { InstillJSONSchema } from "../../../lib";

export type InstillAIOpenAPIProperty = InstillJSONSchema & {
  path?: string;
  instillFormat?: string;
};

export function getPropertiesFromOpenAPISchema(
  schema: InstillJSONSchema,
  parentKey?: string,
  title?: string,
  parentIsArray?: boolean
) {
  let properties: InstillAIOpenAPIProperty[] = [];

  if (schema.type === "object") {
    if (schema.properties) {
      Object.entries(schema.properties).map(([key, value]) => {
        const parentKeyList = parentKey ? parentKey.split(".") : [];

        properties = [
          ...properties,
          ...getPropertiesFromOpenAPISchema(
            value,
            [...parentKeyList, key].join("."),
            key
          ),
        ];
      });
    }
  } else if (schema.type === "array") {
    properties = [
      ...properties,
      {
        ...schema,
        items: getPropertiesFromOpenAPISchema(
          schema.items as InstillJSONSchema,
          parentKey,
          undefined,
          true
        ) as InstillJSONSchema["items"],
        path: parentKey,
        title: schema.title ? schema.title : title,
      },
    ];
  } else {
    if (parentIsArray) {
      properties.push(schema);
    } else {
      properties.push({
        path: parentKey,
        ...schema,
        title: schema.title ? schema.title : title,
      });
    }
  }

  return properties;
}
