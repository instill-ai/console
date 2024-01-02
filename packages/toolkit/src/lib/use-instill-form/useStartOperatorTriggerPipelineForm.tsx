/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as z from "zod";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  transformStartOperatorMetadataToSuperRefineRules,
  transformStartOperatorMetadataToZod,
} from "./transform";
import { useForm } from "react-hook-form";
import {
  PickStartOperatorFreeFormFieldsProps,
  pickStartOperatorFreeFormFields,
} from "./pick";

export type UseStartOperatorTriggerPipelineFormProps = Pick<
  PickStartOperatorFreeFormFieldsProps,
  | "mode"
  | "metadata"
  | "onDeleteField"
  | "onEditField"
  | "disabledFields"
  | "disabledFieldControls"
  | "keyPrefix"
>;

export function useStartOperatorTriggerPipelineForm({
  mode,
  metadata,
  onDeleteField,
  onEditField,
  disabledFields,
  disabledFieldControls,
  keyPrefix,
}: UseStartOperatorTriggerPipelineFormProps) {
  const superRefineRules = React.useMemo(() => {
    if (!metadata) {
      return [];
    }

    return transformStartOperatorMetadataToSuperRefineRules(metadata);
  }, [metadata]);

  const Schema = React.useMemo(() => {
    if (!metadata) {
      return z.object({}) as z.ZodObject<any, any, any>;
    }

    return transformStartOperatorMetadataToZod(metadata);
  }, [metadata]).superRefine((state, ctx) => {
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
    mode: "onChange",
  });

  const fields = React.useMemo(() => {
    if (!metadata) {
      return [];
    }

    const fields = pickStartOperatorFreeFormFields({
      mode,
      metadata,
      form,
      onEditField,
      onDeleteField,
      disabledFields,
      disabledFieldControls,
      keyPrefix,
    });

    return fields;
  }, [
    mode,
    metadata,
    form,
    onEditField,
    onDeleteField,
    disabledFieldControls,
    disabledFields,
    keyPrefix,
  ]);

  return {
    form,
    Schema,
    fields,
  };
}
