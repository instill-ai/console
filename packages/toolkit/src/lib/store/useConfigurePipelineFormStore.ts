import { Nullable } from "../type";
import { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

export const configurePipelineFormFieldSchema = z.object({
  canEdit: z.boolean(),
  pipelineDescription: z.nullable(z.string()),
});

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const validateConfigurePipelineFormSchema = (value: any) =>
  configurePipelineFormFieldSchema.parse(value);

export type ConfigurePipelineFormFields = z.infer<
  typeof configurePipelineFormFieldSchema
>;

export type ConfigurePipelineFormState = {
  formIsDirty: boolean;
  fields: ConfigurePipelineFormFields;
  errors: Record<keyof ConfigurePipelineFormFields, Nullable<string>>;
};

export type ConfigurePipelineFormAction = {
  setFormIsDirty: (isDirty: boolean) => void;
  init: () => void;
  setFieldError: (
    fieldName: keyof ConfigurePipelineFormState["errors"],
    value: Nullable<string>
  ) => void;
  setFieldValue: <T extends keyof ConfigurePipelineFormFields>(
    fieldName: T,
    value: ConfigurePipelineFormFields[T]
  ) => void;
  setFieldsValue: (fields: ConfigurePipelineFormFields) => void;
  setErrorsValue: (errors: ConfigurePipelineFormState["errors"]) => void;
};

export type ConfigurePipelineFormStore = ConfigurePipelineFormState &
  ConfigurePipelineFormAction;

export const configurePipelineFormInitialState: ConfigurePipelineFormState = {
  formIsDirty: false,
  fields: {
    pipelineDescription: null,
    canEdit: false,
  },
  errors: {
    pipelineDescription: null,
    canEdit: null,
  },
};

export const useConfigurePipelineFormStore =
  create<ConfigurePipelineFormStore>()(
    devtools((set) => ({
      ...configurePipelineFormInitialState,
      init: () => set(configurePipelineFormInitialState),
      setFormIsDirty: (isDirty: boolean) =>
        set({
          formIsDirty: isDirty,
        }),
      setFieldError: (fieldName, value) =>
        set(
          produce((draft: ConfigurePipelineFormStore) => {
            draft.errors[fieldName] = value;
          })
        ),
      setFieldValue: (fieldName, value) =>
        set(
          produce((draft: ConfigurePipelineFormStore) => {
            draft.formIsDirty = true;
            draft.fields[fieldName] = value;
          })
        ),
      setFieldsValue: (fields) =>
        set(
          produce((draft: ConfigurePipelineFormStore) => {
            draft.formIsDirty = true;
            draft.fields = fields;
          })
        ),
      setErrorsValue: (errors) =>
        set(
          produce((draft: ConfigurePipelineFormStore) => {
            draft.errors = errors;
          })
        ),
    }))
  );
