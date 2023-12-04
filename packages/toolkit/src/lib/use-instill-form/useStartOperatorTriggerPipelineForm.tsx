/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as z from "zod";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  transformStartOperatorMetadataToSuperRefineRules,
  transformStartOperatorMetadataToZod,
} from "./transform";
import { useForm } from "react-hook-form";
import { pickStartOperatorFreeFormFields } from "./pick";
import { StartOperatorMetadata } from "../vdp-sdk";
import { Nullable } from "../type";

export const useStartOperatorTriggerPipelineForm = (props: {
  metadata: Nullable<StartOperatorMetadata>;
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
}) => {
  const { metadata, onDeleteField, onEditField } = props;

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

    const fields = pickStartOperatorFreeFormFields(
      metadata,
      form,
      onEditField,
      onDeleteField
    );

    return fields;
  }, [metadata, form, onEditField, onDeleteField]);

  return {
    form,
    Schema,
    fields,
  };
};
