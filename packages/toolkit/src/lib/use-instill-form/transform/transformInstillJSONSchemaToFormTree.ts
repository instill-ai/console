import { JSONSchema7Type, JSONSchema7TypeName } from "json-schema";
import { Nullable } from "../../type";
import { pickConstInfoFromOneOfCondition } from "../pick";
import {
  InstillFormGroupItem,
  InstillFormTree,
  InstillJSONSchema,
  InstillJSONSchemaDefinition,
  CheckIsHidden,
} from "../type";

export type TransformInstillJSONSchemaToFormTreeOptions = {
  key?: string;
  path?: string;
  parentSchema?: InstillJSONSchema;
  checkIsHidden?: CheckIsHidden;
};

export function transformInstillJSONSchemaToFormTree(
  targetSchema: InstillJSONSchemaDefinition,
  options?: TransformInstillJSONSchemaToFormTreeOptions
): InstillFormTree {
  let isRequired = false;
  const key = options?.key;
  const path = options?.path;
  const parentSchema = options?.parentSchema;
  const checkIsHidden = options?.checkIsHidden;

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
          transformInstillJSONSchemaToFormTree(
            { type: targetSchema.type, ...condition },
            {
              parentSchema,
              key,
              path,
              checkIsHidden,
            }
          ),
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
    const propertyFormTree = transformInstillJSONSchemaToFormTree(
      targetSchema.items,
      {
        parentSchema: targetSchema,
        key,
        path,
        checkIsHidden,
      }
    ) as InstillFormGroupItem;

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
    const properties = Object.entries(targetSchema.properties || [])
      .map(([key, schema]) =>
        transformInstillJSONSchemaToFormTree(schema, {
          parentSchema: targetSchema,
          key,
          path: path ? `${path}.${key}` : key,
          checkIsHidden,
        })
      )
      .sort((a, b) => {
        if (typeof a.instillUIOrder === "undefined") {
          return 1;
        }

        if (typeof b.instillUIOrder === "undefined") {
          return -1;
        }

        return a.instillUIOrder > b.instillUIOrder ? 1 : -1;
      });

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

  let isHidden = false;

  if (
    checkIsHidden &&
    checkIsHidden({
      parentSchema: parentSchema ?? null,
      targetSchema,
      targetKey: key ?? null,
    })
  ) {
    isHidden = true;
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

      // We will store information of enum in anyOf field

      if (instillUpstreamValue.enum) {
        return {
          ...pickBaseFields(targetSchema),
          _type: "formItem",
          fieldKey: key ?? null,
          path: (path || key) ?? null,
          isRequired,
          type: type ? type : "null",
          enum: instillUpstreamValue.enum,
          example: instillUpstreamValue.example,
          examples: instillUpstreamValue.examples,
          isHidden,
        };
      }
    }
  } else {
    if (Array.isArray(targetSchema.type)) {
      type = targetSchema.type[0] ?? null;
    } else {
      type = targetSchema.type ?? null;
    }
  }

  return {
    ...pickBaseFields(targetSchema),
    _type: "formItem",
    fieldKey: key ?? null,
    path: (path || key) ?? null,
    isRequired,
    type: type ? type : "null",
    isHidden,
  };
}

const baseFields: Array<keyof InstillJSONSchema> = [
  "default",
  "example",
  "examples",
  "description",
  "pattern",
  "const",
  "title",
  "instillShortDescription",
  "instillUpstreamTypes",
  "instillUpstreamType",
  "instillFormat",
  "instillCredentialField",
  "instillUIOrder",
  "instillEditOnNodeFields",
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
