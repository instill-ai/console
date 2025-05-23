/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  pickPipelineTriggerRequestFormFields,
  PickPipelineTriggerRequestFormFieldsProps,
} from "./pick";
import {
  transformPipelineTriggerRequestFieldsToSuperRefineRules,
  transformPipelineTriggerRequestFieldsToZod,
} from "./transform";

export type UseStartOperatorTriggerPipelineFormProps = Pick<
  PickPipelineTriggerRequestFormFieldsProps,
  | "mode"
  | "onDeleteField"
  | "onEditField"
  | "disabledFields"
  | "disabledFieldControls"
  | "disabledReferenceHint"
  | "keyPrefix"
  | "fields"
  | "forceStringMultiline"
> & { values?: Record<string, any> };

export function usePipelineTriggerRequestForm({
  mode,
  fields,
  onDeleteField,
  onEditField,
  disabledFields,
  disabledFieldControls,
  disabledReferenceHint,
  keyPrefix,
  values,
  forceStringMultiline,
}: UseStartOperatorTriggerPipelineFormProps) {
  const superRefineRules = React.useMemo(() => {
    if (!fields) {
      return [];
    }

    return transformPipelineTriggerRequestFieldsToSuperRefineRules(fields);
  }, [fields]);

  const Schema = React.useMemo(() => {
    if (!fields) {
      return z.object({}) as z.ZodObject<any, any, any>;
    }

    return transformPipelineTriggerRequestFieldsToZod(fields);
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
    values,
  });

  const fieldItems = React.useMemo(() => {
    if (!fields) {
      return [];
    }

    return pickPipelineTriggerRequestFormFields({
      mode,
      fields,
      form,
      onEditField,
      onDeleteField,
      disabledFields,
      disabledFieldControls,
      disabledReferenceHint,
      keyPrefix,
      forceStringMultiline,
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
    forceStringMultiline,
  ]);

  return {
    form,
    Schema,
    fieldItems,
  };
}
