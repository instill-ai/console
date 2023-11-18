/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as z from "zod";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { StartNodeData } from "../../view";
import {
  transformStartOperatorMetadataToSuperRefineRules,
  transformStartOperatorMetadataToZod,
} from "./transform";
import { useForm } from "react-hook-form";
import { pickStartOperatorFreeFormFieldItems } from "./pick/pickStartOperatorFreeFormFieldItems";

export const useStartOperatorFreeForm = (props: {
  data: StartNodeData;
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
}) => {
  const { data, onDeleteField, onEditField } = props;

  const superRefineRules = React.useMemo(() => {
    if (!data.component.configuration.metadata) {
      return [];
    }

    return transformStartOperatorMetadataToSuperRefineRules(
      data.component.configuration.metadata
    );
  }, [data]);

  const Schema = React.useMemo(() => {
    if (!data.component.configuration.metadata) {
      return z.object({}) as z.ZodObject<any, any, any>;
    }

    return transformStartOperatorMetadataToZod(
      data.component.configuration.metadata
    );
  }, [data]).superRefine((state, ctx) => {
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

  const fieldItems = React.useMemo(() => {
    if (!data.component.configuration.metadata) {
      return [];
    }

    return pickStartOperatorFreeFormFieldItems(
      data.component.configuration.metadata,
      form,
      onEditField,
      onDeleteField
    );
  }, [data, form]);

  return {
    form,
    Schema,
    fieldItems,
  };
};
