/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as z from "zod";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PickStartOperatorFreeFormFieldItemsProps,
  pickStartOperatorFreeFormFieldItems,
} from "./pick";
import {
  transformStartOperatorFieldsToSuperRefineRules,
  transformStartOperatorFieldsToZod,
} from "./transform";

export type UseStartOperatorTriggerPipelineFormProps = Pick<
  PickStartOperatorFreeFormFieldItemsProps,
  | "mode"
  | "onDeleteField"
  | "onEditField"
  | "disabledFields"
  | "disabledFieldControls"
  | "disabledReferenceHint"
  | "keyPrefix"
  | "fields"
>;

export function useStartOperatorTriggerPipelineForm({
  mode,
  fields,
  onDeleteField,
  onEditField,
  disabledFields,
  disabledFieldControls,
  disabledReferenceHint,
  keyPrefix,
}: UseStartOperatorTriggerPipelineFormProps) {
  const superRefineRules = React.useMemo(() => {
    if (!fields) {
      return [];
    }

    return transformStartOperatorFieldsToSuperRefineRules(fields);
  }, [fields]);

  const Schema = React.useMemo(() => {
    if (!fields) {
      return z.object({}) as z.ZodObject<any, any, any>;
    }

    return transformStartOperatorFieldsToZod(fields);
  }, [fields]).superRefine((state, ctx) => {
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

  const fieldItems = React.useMemo(() => {
    if (!fields) {
      return [];
    }

    return pickStartOperatorFreeFormFieldItems({
      mode,
      fields,
      form,
      onEditField,
      onDeleteField,
      disabledFields,
      disabledFieldControls,
      disabledReferenceHint,
      keyPrefix,
    });
  }, [
    mode,
    fields,
    form,
    onEditField,
    onDeleteField,
    disabledFieldControls,
    disabledReferenceHint,
    disabledFields,
    keyPrefix,
  ]);

  return {
    form,
    Schema,
    fieldItems,
  };
}
