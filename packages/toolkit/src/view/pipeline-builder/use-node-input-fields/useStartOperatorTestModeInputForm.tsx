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
import { Nullable, StartOperatorBody, SuperRefineRule } from "../../../lib";

export const useStartOperatorTestModeInputForm = (props: {
  nodes: Node<NodeData>[];
}) => {
  const { nodes } = props;

  const superRefineRules = React.useMemo(() => {
    // We can guarantee that there is one start node
    const startNode = nodes.find(
      (node) => node.data.nodeType === "start"
    ) as Node<StartNodeData>;

    return transformStartOperatorBodyToSuperRefineRules(
      startNode.data.component.configuration.metadata
    );
  }, [nodes]);

  const Schema = React.useMemo(() => {
    // We can guarantee that there is one start node
    const startNode = nodes.find(
      (node) => node.data.nodeType === "start"
    ) as Node<StartNodeData>;

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
  body: Nullable<StartOperatorBody>
) {
  let zodSchema: z.ZodObject<any, any, any> = z.object({});

  if (!body) return zodSchema;

  for (const [key, value] of Object.entries(body)) {
    switch (value.type) {
      case "text":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "text_array":
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
      case "number_array":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.coerce.number().nullable().optional()).nullable().optional()
        );
        break;
      case "audio":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "audio_array":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string()).nullable().optional()
        );
        break;
      case "image":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "image_array":
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
  body: Nullable<StartOperatorBody>,
  form: UseFormReturn<{ [k: string]: any }, any, undefined>
) {
  const fields: React.ReactElement[] = [];

  if (!body) return fields;

  // This component will only be displayed under test mode, and under test
  // /view-only mode, we will display user defined title as title.

  for (const [key, input] of Object.entries(body)) {
    switch (input.type) {
      case "text":
        fields.push(
          <TextField form={form} fieldKey={key} title={input.title} />
        );
        break;
      case "text_array": {
        fields.push(
          <TextsField form={form} fieldKey={key} title={input.title} />
        );
        break;
      }
      case "boolean":
        fields.push(
          <BooleanField form={form} fieldKey={key} title={input.title} />
        );
        break;
      case "number":
        fields.push(
          <NumberField form={form} fieldKey={key} title={input.title} />
        );
        break;
      case "number_array":
        fields.push(
          <NumbersField form={form} fieldKey={key} title={input.title} />
        );
        break;
      case "audio":
        fields.push(
          <AudioField form={form} fieldKey={key} title={input.title} />
        );
        break;
      case "audio_array":
        fields.push(
          <AudiosField form={form} fieldKey={key} title={input.title} />
        );
        break;
      case "image":
        fields.push(
          <ImageField form={form} fieldKey={key} title={input.title} />
        );
        break;
      case "image_array":
        fields.push(
          <ImagesField form={form} fieldKey={key} title={input.title} />
        );
        break;
      default:
        break;
    }
  }

  return fields;
}

export function transformStartOperatorBodyToSuperRefineRules(
  body: Nullable<StartOperatorBody>
) {
  const rules: SuperRefineRule[] = [];

  if (!body) return rules;

  for (const [key, input] of Object.entries(body)) {
    switch (input.type) {
      case "text":
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
      case "text_array":
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
      case "number_array":
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
      case "audio_array":
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
      case "image_array":
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
