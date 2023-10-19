import { Nullable } from "../type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

import { z } from "zod";
import { validateResourceId } from "../utility";

// Althought userName is nullable, we need to verify its existence before
// submit it.

export const configureProfileFormFieldSchema = z.object({
  firstName: z.nullable(z.string()),
  lastName: z.nullable(z.string()),
  userName: z.nullable(z.string()),
  orgName: z.nullable(z.string()),
  role: z.nullable(z.string()),
  newsletterSubscription: z.nullable(z.boolean()),
});

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const validateConfigureProfileFormFieldSchema = (value: any) =>
  configureProfileFormFieldSchema
    .superRefine((state, ctx) => {
      if (!state.userName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["userName"],
          message: "Username is required.",
        });
      } else {
        if (!validateResourceId(state.userName)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["userName"],
            message:
              "Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum.",
          });
        }
      }
    })
    .parse(value);

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
    firstName: null,
    lastName: null,
    userName: null,
    orgName: null,
    role: null,
    newsletterSubscription: null,
  },
  errors: {
    firstName: null,
    lastName: null,
    userName: null,
    orgName: null,
    role: null,
    newsletterSubscription: null,
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
