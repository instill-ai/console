import { Nullable } from "../type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

import { z } from "zod";
import { validateResourceId } from "../utility";

// Althought id is nullable, we need to verify its existence before
// submit it.

export const configureProfileFormFieldSchema = z.object({
  first_name: z.nullable(z.string()),
  last_name: z.nullable(z.string()),
  id: z.nullable(z.string()),
  org_name: z.nullable(z.string()),
  role: z.nullable(z.string()),
  newsletter_subscription: z.nullable(z.boolean()),
});

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const validateConfigureProfileFormFieldSchema = (value: any) =>
  configureProfileFormFieldSchema;

export type ProfileFormFields = z.infer<typeof configureProfileFormFieldSchema>;

export type ConfigureProfileFormState = {
  formIsDirty: boolean;
  fields: ProfileFormFields;
  errors: Record<keyof ProfileFormFields, Nullable<string>>;
};

export type ConfigureProfileFormAction = {
  setFormIsDirty: (isDirty: boolean) => void;
  init: () => void;
  setFieldError: (
    fieldName: keyof ConfigureProfileFormState["errors"],
    value: Nullable<string>
  ) => void;
  setFieldValue: <T extends keyof ProfileFormFields>(
    fieldName: T,
    value: ProfileFormFields[T]
  ) => void;
  setFieldsValue: (fields: ProfileFormFields) => void;
  setErrorsValue: (errors: ConfigureProfileFormState["errors"]) => void;
};

export type ConfigureProfileFormStore = ConfigureProfileFormState &
  ConfigureProfileFormAction;

export const configureProfileFormInitialState: ConfigureProfileFormState = {
  formIsDirty: false,
  fields: {
    first_name: null,
    last_name: null,
    id: null,
    org_name: null,
    role: null,
    newsletter_subscription: null,
  },
  errors: {
    first_name: null,
    last_name: null,
    id: null,
    org_name: null,
    role: null,
    newsletter_subscription: null,
  },
};

export const useConfigureProfileFormStore = create<ConfigureProfileFormStore>()(
  devtools((set) => ({
    ...configureProfileFormInitialState,
    init: () => set(configureProfileFormInitialState),
    setFormIsDirty: (isDirty: boolean) =>
      set({
        formIsDirty: isDirty,
      }),
    setFieldError: (fieldName, value) =>
      set(
        produce((draft: ConfigureProfileFormStore) => {
          draft.errors[fieldName] = value;
        })
      ),
    setFieldValue: (fieldName, value) =>
      set(
        produce((draft: ConfigureProfileFormStore) => {
          draft.formIsDirty = true;
          draft.fields[fieldName] = value;
        })
      ),
    setFieldsValue: (fields) =>
      set(
        produce((draft: ConfigureProfileFormStore) => {
          draft.formIsDirty = true;
          draft.fields = fields;
        })
      ),
    setErrorsValue: (errors) =>
      set(
        produce((draft: ConfigureProfileFormStore) => {
          draft.errors = errors;
        })
      ),
  }))
);
