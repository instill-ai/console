import * as z from "zod";
import * as React from "react";

import { UseFormReturn, useForm } from "react-hook-form";
import { Node } from "reactflow";
import { NodeData, StartNodeData } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { StringField } from "./StringField";
import { StartOperatorBody } from "./type";
import { NumberField } from "./NumberField";
import { BooleanField } from "./BooleanField";
import { AudioField } from "./AudioField";
import { ImageField } from "./ImageField";
import { Nullable } from "@instill-ai/toolkit";

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
  const zodSchema: z.ZodObject<any, any, any> = z.object({});

  if (!body) return zodSchema;

  for (const [key, value] of Object.entries(body)) {
    switch (value.type) {
      case "text":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "boolean":
        zodSchema = zodSchema.setKey(key, z.boolean().nullable().optional());
        break;
      case "number":
        zodSchema = zodSchema.setKey(
          key,
          z.coerce
            .number()
            .positive({ message: "Value must be positive" })
            .nullable()
            .optional()
        );
        break;
      case "audio":
        zodSchema = zodSchema.setKey(
          key,
          z.instanceof(File).nullable().optional()
        );
        break;
      case "image":
        zodSchema = zodSchema.setKey(
          key,
          z.instanceof(File).nullable().optional()
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

  for (const [key, input] of Object.entries(body)) {
    switch (input.type) {
      case "text":
        fields.push(
          <StringField form={form} fieldKey={key} title={input.title} />
        );
        break;
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
      case "audio":
        fields.push(
          <AudioField form={form} fieldKey={key} title={input.title} />
        );
        break;
      case "image":
        fields.push(
          <ImageField form={form} fieldKey={key} title={input.title} />
        );
        break;
      default:
        break;
    }
  }

  return fields;
}

export type SuperRefineRule = {
  key: string;
  validator: (value: any) => SuperRefineRuleValidatorReturn;
};

export type SuperRefineRuleValidatorReturn =
  | SuperRefineRuleValidatorValidReturn
  | SuperRefineRuleValidatorInvalidReturn;

export type SuperRefineRuleValidatorValidReturn = {
  valid: true;
};

export type SuperRefineRuleValidatorInvalidReturn = {
  valid: false;
  error: string;
};

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
            if (typeof value !== "number") {
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
      default:
        break;
    }
  }

  return rules;
}
