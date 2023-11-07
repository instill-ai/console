/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as z from "zod";
import * as React from "react";

import { UseFormReturn, useForm } from "react-hook-form";
import { Node } from "reactflow";
import { NodeData, StartNodeData } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import { BooleanField } from "./BooleanField";
import { AudioField } from "./AudioField";
import { ImageField } from "./ImageField";
import { TextsField } from "./TextsField";
import { ImagesField } from "./ImagesField";
import { NumbersField } from "./NumbersField";
import { AudiosField } from "./AudiosField";
import { Nullable, StartOperatorMetadata, SuperRefineRule } from "../../../lib";

export const useStartOperatorTestModeInputForm = (props: {
  nodes: Node<NodeData>[];
}) => {
  const { nodes } = props;

  const superRefineRules = React.useMemo(() => {
    // We can guarantee that there is one start node
    const startNode = nodes.find(
      (node) => node.data.nodeType === "start"
    ) as Node<StartNodeData>;

    if (!startNode.data.component.configuration.metadata) {
      return [];
    }

    return transformStartOperatorBodyToSuperRefineRules(
      startNode.data.component.configuration.metadata
    );
  }, [nodes]);

  const Schema = React.useMemo(() => {
    // We can guarantee that there is one start node
    const startNode = nodes.find(
      (node) => node.data.nodeType === "start"
    ) as Node<StartNodeData>;

    if (!startNode.data.component.configuration.metadata) {
      return z.object({}) as z.ZodObject<any, any, any>;
    }

    return transformStartOperatorBodyToZod(
      startNode.data.component.configuration.metadata
    );
  }, [nodes]).superRefine((state, ctx) => {
    for (const rule of superRefineRules) {
      const result = rule.validator(state[rule.key]);
      if (!result.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: [rule.key],
        });
      }
    }
  });

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });

  const fields = React.useMemo(() => {
    const startNode = nodes.find(
      (node) => node.data.nodeType === "start"
    ) as Node<StartNodeData>;

    if (!startNode.data.component.configuration.metadata) {
      return [];
    }

    return transformStartOperatorBodyToFields(
      startNode.data.component.configuration.metadata,
      form
    );
  }, [nodes, form]);

  return {
    form,
    Schema,
    fields,
  };
};

export function transformStartOperatorBodyToZod(
  metadata: Nullable<StartOperatorMetadata>
) {
  let zodSchema: z.ZodObject<any, any, any> = z.object({});

  if (!metadata) return zodSchema;

  for (const [key, value] of Object.entries(metadata)) {
    switch (value.instillFormat) {
      case "string":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "array:string":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string().nullable().optional()).nullable().optional()
        );
        break;
      case "boolean":
        zodSchema = zodSchema.setKey(key, z.boolean().nullable().optional());
        break;
      case "number":
        zodSchema = zodSchema.setKey(
          key,
          z.coerce.number().nullable().optional()
        );
        break;
      case "array:number":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.coerce.number().nullable().optional()).nullable().optional()
        );
        break;
      case "audio":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "array:audio/*":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string()).nullable().optional()
        );
        break;
      case "image":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "array:image/*":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string()).nullable().optional()
        );
        break;
      default:
        break;
    }
  }

  return zodSchema;
}

export function transformStartOperatorBodyToFields(
  metadata: Nullable<StartOperatorMetadata>,
  form: UseFormReturn<{ [k: string]: any }, any, undefined>
) {
  const fields: React.ReactElement[] = [];

  if (!metadata) return fields;

  // This component will only be displayed under test mode, and under test
  // /view-only mode, we will display user defined title as title.

  for (const [key, value] of Object.entries(metadata)) {
    switch (value.instillFormat) {
      case "string":
        fields.push(
          <TextField form={form} fieldKey={key} title={value.title} />
        );
        break;
      case "array:string": {
        fields.push(
          <TextsField form={form} fieldKey={key} title={value.title} />
        );
        break;
      }
      case "boolean":
        fields.push(
          <BooleanField form={form} fieldKey={key} title={value.title} />
        );
        break;
      case "number":
        fields.push(
          <NumberField form={form} fieldKey={key} title={value.title} />
        );
        break;
      case "array:number":
        fields.push(
          <NumbersField form={form} fieldKey={key} title={value.title} />
        );
        break;
      case "audio":
        fields.push(
          <AudioField form={form} fieldKey={key} title={value.title} />
        );
        break;
      case "array:audio/*":
        fields.push(
          <AudiosField form={form} fieldKey={key} title={value.title} />
        );
        break;
      case "image":
        fields.push(
          <ImageField form={form} fieldKey={key} title={value.title} />
        );
        break;
      case "array:image/*":
        fields.push(
          <ImagesField form={form} fieldKey={key} title={value.title} />
        );
        break;
      default:
        break;
    }
  }

  return fields;
}

export function transformStartOperatorBodyToSuperRefineRules(
  metadata: Nullable<StartOperatorMetadata>
) {
  const rules: SuperRefineRule[] = [];

  if (!metadata) return rules;

  for (const [key, value] of Object.entries(metadata)) {
    switch (value.instillFormat) {
      case "string":
        rules.push({
          key,
          validator: (value) => {
            if (typeof value !== "string") {
              return {
                valid: false,
                error: `${key} must be a string`,
              };
            }
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "array:string":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            }
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "boolean":
        rules.push({
          key,
          validator: (value) => {
            if (typeof value !== "boolean") {
              return {
                valid: false,
                error: `${key} must be a boolean`,
              };
            }
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "number":
        rules.push({
          key,
          validator: (value) => {
            if (isNaN(Number(value))) {
              return {
                valid: false,
                error: `${key} must be a number`,
              };
            }
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "array:number":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            } else {
              for (const v of value) {
                if (isNaN(Number(v))) {
                  return {
                    valid: false,
                    error: `${key} must be an array of number`,
                  };
                }
              }
            }
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "audio":
        rules.push({
          key,
          validator: (value) => {
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "array:audio/*":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            }
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "image":
        rules.push({
          key,
          validator: (value) => {
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "array:image/*":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            }
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      default:
        break;
    }
  }

  return rules;
}
