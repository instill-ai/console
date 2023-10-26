import { JSONSchema7TypeName } from "json-schema";
import { Nullable } from "../../type";
import { pickConstInfoFromOneOfCondition } from "../pick";
import {
  InstillFormGroupItem,
  InstillFormTree,
  InstillJSONSchema,
  InstillJSONSchemaDefinition,
} from "../type";

export function transformInstillJSONSchemaToFormTree({
  targetSchema,
  key,
  path,
  parentSchema,
}: {
  targetSchema: InstillJSONSchemaDefinition;
  key?: string;
  path?: string;
  parentSchema?: InstillJSONSchema;
}): InstillFormTree {
  let isRequired = false;

  if (
    key &&
    typeof parentSchema !== "boolean" &&
    Array.isArray(parentSchema?.required) &&
    parentSchema?.required.includes(key)
  ) {
    isRequired = true;
  }

  if (typeof targetSchema === "boolean") {
    return {
      _type: "formItem",
      fieldKey: key ?? null,
      path: (path || key) ?? null,
      isRequired: false,
      type: "null",
    };
  }

  if (targetSchema.oneOf && targetSchema.oneOf.length > 0) {
    const conditions = Object.fromEntries(
      targetSchema.oneOf.map((condition) => {
        if (typeof condition === "boolean") {
          return [];
        }

        const { constKey, constValue } = pickConstInfoFromOneOfCondition(
          condition.properties ?? {}
        );

        if (!constKey || !constValue) {
          return [];
        }

        return [
          constValue,
          transformInstillJSONSchemaToFormTree({
            targetSchema: { type: targetSchema.type, ...condition },
            parentSchema,
            key,
            path,
          }),
        ];
      })
    );

    const constField = targetSchema.oneOf[0].properties
      ? Object.entries(targetSchema.oneOf[0].properties).find(
          ([, property]) => "const" in property
        )?.[1]
      : undefined;

    const constBaseFields = pickBaseFields(constField ?? {});

    delete constBaseFields.const;

    return {
      ...constBaseFields,
      ...pickBaseFields(targetSchema),
      _type: "formCondition",
      fieldKey: key ?? null,
      path: (path || key) ?? null,
      conditions,
      isRequired,
      jsonSchema: targetSchema,
    };
  }

  if (
    targetSchema.type === "array" &&
    typeof targetSchema.items === "object" &&
    !Array.isArray(targetSchema.items) &&
    targetSchema.items.type === "object"
  ) {
    const propertyFormTree = transformInstillJSONSchemaToFormTree({
      targetSchema: targetSchema.items,
      parentSchema: targetSchema,
      key,
      path,
    }) as InstillFormGroupItem;

    return {
      ...pickBaseFields(targetSchema),
      ...propertyFormTree,
      _type: "formArray",
      fieldKey: key ?? null,
      path: (path || key) ?? null,
      isRequired,
    };
  }

  if (targetSchema.properties) {
    const properties = Object.entries(targetSchema.properties || []).map(
      ([key, schema]) =>
        transformInstillJSONSchemaToFormTree({
          targetSchema: schema,
          parentSchema: targetSchema,
          key,
          path: path ? `${path}.${key}` : key,
        })
    );

    return {
      ...pickBaseFields(targetSchema),
      _type: "formGroup",
      fieldKey: key ?? null,
      path: (path || key) ?? null,
      isRequired,
      jsonSchema: targetSchema,
      properties: properties ?? [],
    };
  }

  /* -----------------------------------------------------------------------
    We are using anyOf field on formItem to store the types
  * -----------------------------------------------------------------------*/

  let type: Nullable<JSONSchema7TypeName> = null;

  if (targetSchema.anyOf && targetSchema.anyOf.length > 0) {
    const instillUpstreamValue = targetSchema.anyOf.find(
      (e) => e.instillUpstreamType === "value"
    );

    if (instillUpstreamValue) {
      if (Array.isArray(instillUpstreamValue.type)) {
        type = instillUpstreamValue.type[0];
      } else {
        type = instillUpstreamValue.type ?? null;
      }
    }
  }

  return {
    ...pickBaseFields(targetSchema),
    _type: "formItem",
    fieldKey: key ?? null,
    path: (path || key) ?? null,
    isRequired,
    type: type ? type : "null",
  };
}

const baseFields: Array<keyof InstillJSONSchema> = [
  "default",
  "example",
  "examples",
  "description",
  "additionalDescription",
  "pattern",
  "const",
  "title",
  "instillEditOnNode",
  "instillUpstreamTypes",
  "instillUpstreamType",
  "instillCredentialField",
];

function pickBaseFields(schema: InstillJSONSchema): Partial<InstillJSONSchema> {
  const partialSchema: Partial<InstillJSONSchema> = {
    ...Object.fromEntries(
      Object.entries(schema).filter(([k]) =>
        baseFields.includes(k as keyof InstillJSONSchema)
      )
    ),
  };

  if (
    typeof schema.items === "object" &&
    !Array.isArray(schema.items) &&
    schema.items.enum
  ) {
    partialSchema.enum = schema.items.enum;
  } else if (schema.enum) {
    if (schema.enum?.length === 1 && isDefined(schema.default)) {
      partialSchema.const = schema.default;
    } else {
      partialSchema.enum = schema.enum;
    }
  }

  return partialSchema;
}

function isDefined<T>(
  a: T | null | undefined
): a is Exclude<T, null | undefined> {
  return a !== undefined && a !== null;
}
