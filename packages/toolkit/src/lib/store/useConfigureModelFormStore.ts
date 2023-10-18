import { Nullable } from "../type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { z } from "zod";
import produce from "immer";

export const configureModelFormFieldSchema = z.object({
  description: z.string().nullable(),
});

export const validateConfigureModelFormSchema = (value: any) =>
  configureModelFormFieldSchema.parse(value);

export type ConfigureModelFormFields = z.infer<
  typeof configureModelFormFieldSchema
>;

export type ConfigureModelFormState = {
  formIsDirty: boolean;
  fields: ConfigureModelFormFields;
  errors: Record<keyof ConfigureModelFormFields, Nullable<string>>;
};

export type ConfigureModelFormAction = {
  setFormIsDirty: (isDirty: boolean) => void;
  init: () => void;
  setFieldError: (
    fieldName: keyof ConfigureModelFormState["errors"],
    value: Nullable<string>
  ) => void;
  setFieldValue: <T extends keyof ConfigureModelFormFields>(
    fieldName: T,
    value: ConfigureModelFormFields[T]
  ) => void;
  setFieldsValue: (fields: ConfigureModelFormFields) => void;
  setErrorsValue: (errors: ConfigureModelFormState["errors"]) => void;
};

export type ConfigureModelFormStore = ConfigureModelFormState &
  ConfigureModelFormAction;

export const configureModelFormInitialState: ConfigureModelFormState = {
  formIsDirty: false,
  fields: { description: null },
  errors: { description: null },
};

export const useConfigureModelFormStore = create<ConfigureModelFormStore>()(
  devtools((set) => ({
    ...configureModelFormInitialState,
    init: () => set(configureModelFormInitialState),
    setFormIsDirty: (isDirty: boolean) =>
      set({
        formIsDirty: isDirty,
      }),
    setFieldError: (fieldName, value) =>
      set(
        produce((draft: ConfigureModelFormStore) => {
          draft.errors[fieldName] = value;
        })
      ),
    setFieldValue: (fieldName, value) =>
      set(
        produce((draft: ConfigureModelFormStore) => {
          draft.formIsDirty = true;
          draft.fields[fieldName] = value;
        })
      ),
    setFieldsValue: (fields) =>
      set(
        produce((draft: ConfigureModelFormStore) => {
          draft.formIsDirty = true;
          draft.fields = fields;
        })
      ),
    setErrorsValue: (errors) =>
      set(
        produce((draft: ConfigureModelFormStore) => {
          draft.errors = errors;
        })
      ),
  }))
);
