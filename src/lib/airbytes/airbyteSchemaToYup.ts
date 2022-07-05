import { AirbyteJsonSchema, SelectedItemMap } from "./types";
import * as yup from "yup";
import { Nullable } from "@/types/general";

const airbyteSchemaToYup = (
  jsonSchema: AirbyteJsonSchema,
  selectedItemMap: Nullable<SelectedItemMap>,
  parentSchema?: AirbyteJsonSchema,
  propertyKey?: string,
  propertyPath: string | undefined = propertyKey
): yup.AnySchema => {
  let schema:
    | yup.NumberSchema
    | yup.StringSchema
    | yup.AnyObjectSchema
    | yup.ArraySchema<yup.AnySchema>
    | yup.BooleanSchema
    | null = null;

  if (jsonSchema.oneOf && selectedItemMap && propertyPath) {
    let selectedSchema = jsonSchema.oneOf.find(
      (condition) =>
        typeof condition !== "boolean" &&
        condition.title === selectedItemMap[propertyPath]?.selectedItem
    );

    // Select first oneOf path if no item selected
    selectedSchema = selectedSchema ?? jsonSchema.oneOf[0];

    if (selectedSchema && typeof selectedSchema !== "boolean") {
      return airbyteSchemaToYup(
        { type: jsonSchema.type, ...selectedSchema },
        selectedItemMap,
        jsonSchema,
        propertyKey,
        propertyPath
      );
    }
  }

  switch (jsonSchema.type) {
    case "array": {
      if (
        typeof jsonSchema.items === "object" &&
        !Array.isArray(jsonSchema.items)
      ) {
        schema = yup
          .array()
          .of(
            airbyteSchemaToYup(
              jsonSchema.items,
              selectedItemMap,
              jsonSchema,
              propertyKey,
              propertyPath
            )
          );
      }
      //console.log("array", schema);
      break;
    }
    case "object": {
      let objectSchema = yup.object();

      const keyEntries = Object.entries(jsonSchema.properties || {}).map(
        ([propertyKey, condition]) => [
          propertyKey,
          typeof condition !== "boolean"
            ? airbyteSchemaToYup(
                condition,
                selectedItemMap,
                jsonSchema,
                propertyKey,
                propertyPath ? `${propertyPath}.${propertyKey}` : propertyKey
              )
            : yup.mixed(),
        ]
      );

      if (keyEntries.length) {
        objectSchema = objectSchema.shape(Object.fromEntries(keyEntries));
      } else {
        objectSchema = objectSchema.default({});
      }

      //console.log("object", objectSchema);
      schema = objectSchema;
      break;
    }
    case "string": {
      schema = yup.string();

      if (jsonSchema?.pattern !== undefined) {
        schema = schema.matches(
          new RegExp(jsonSchema.pattern),
          "form.pattern.error"
        );
      }
      //console.log("string", schema);
      break;
    }
    case "boolean": {
      schema = yup.boolean();
      break;
    }
    case "integer": {
      schema = yup.number();

      if (jsonSchema?.minimum !== undefined) {
        schema = schema.min(jsonSchema?.minimum);
      }

      if (jsonSchema?.maximum !== undefined) {
        schema = schema.max(jsonSchema?.maximum);
      }
      break;
    }
  }

  const isRequired =
    parentSchema &&
    Array.isArray(parentSchema?.required) &&
    parentSchema.required.find((item) => item === propertyKey);

  if (schema && isRequired) {
    schema = schema.required();
  }

  return schema || yup.mixed();
};

export default airbyteSchemaToYup;
