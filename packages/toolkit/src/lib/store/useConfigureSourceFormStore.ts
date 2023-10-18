import { Nullable } from "../type";
import { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

export const configureSourceFormFieldSchema = z.object({
  canEdit: z.boolean(),
});

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const validateConfigureSourceFormSchema = (value: any) =>
  configureSourceFormFieldSchema.parse(value);

export type ConfigureSourceFormFields = z.infer<
  typeof configureSourceFormFieldSchema
>;

export type ConfigureSourceFormState = {
  formIsDirty: boolean;
  fields: ConfigureSourceFormFields;
  errors: Record<keyof ConfigureSourceFormFields, Nullable<string>>;
};

export type ConfigureSourceFormAction = {
  setFormIsDirty: (isDirty: boolean) => void;
  init: () => void;
  setFieldError: (
    fieldName: keyof ConfigureSourceFormState["errors"],
    value: Nullable<string>
  ) => void;
  setFieldValue: <T extends keyof ConfigureSourceFormFields>(
    fieldName: T,
    value: ConfigureSourceFormFields[T]
  ) => void;
  setFieldsValue: (fields: ConfigureSourceFormFields) => void;
  setErrorsValue: (errors: ConfigureSourceFormState["errors"]) => void;
};

export type ConfigureSourceFormStore = ConfigureSourceFormState &
  ConfigureSourceFormAction;

export const configureSourceFormInitialState: ConfigureSourceFormState = {
  formIsDirty: false,
  fields: {
    canEdit: false,
  },
  errors: {
    canEdit: null,
  },
};

export const useConfigureSourceFormStore = create<ConfigureSourceFormStore>()(
  devtools((set) => ({
    ...configureSourceFormInitialState,
    init: () => set(configureSourceFormInitialState),
    setFormIsDirty: (isDirty: boolean) =>
      set({
        formIsDirty: isDirty,
      }),
    setFieldError: (fieldName, value) =>
      set(
        produce((draft: ConfigureSourceFormStore) => {
          draft.errors[fieldName] = value;
        })
      ),
    setFieldValue: (fieldName, value) =>
      set(
        produce((draft: ConfigureSourceFormStore) => {
          draft.formIsDirty = true;
          draft.fields[fieldName] = value;
        })
      ),
    setFieldsValue: (fields) =>
      set(
        produce((draft: ConfigureSourceFormStore) => {
          draft.formIsDirty = true;
          draft.fields = fields;
        })
      ),
    setErrorsValue: (errors) =>
      set(
        produce((draft: ConfigureSourceFormStore) => {
          draft.errors = errors;
        })
      ),
  }))
);
