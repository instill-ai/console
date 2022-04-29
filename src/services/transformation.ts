import { FormField } from "@/components/forms/FormData";

type Schema = {
  title: string;
  type: string;
  $id: string;
  $schema: string;
  additionalProperties: boolean;
  description: string;
  required: string[];
  properties: Record<string, any>;
};

export const transformSchemaToFormFields = (schema: Schema): FormField[] => {
  const formFields: FormField[] = [];

  for (const [fieldName, fieldConfig] of Object.entries(schema.properties)) {
    const formField = {} as FormField;

    if (fieldConfig.readOnly && fieldConfig.readOnly === true) {
      continue;
    }

    formField.description = fieldConfig.description ?? null;
    formField.title = fieldConfig.title ?? null;
    formField.type = fieldConfig.type ?? null;
    formField.order = fieldConfig.order ?? null;
    formField.options = fieldConfig.enum ?? null;
    formField.required = schema.required.includes(fieldName) ? true : false;
    formField.readonly = fieldConfig.readOnly ?? false;
    formField.pattern = fieldConfig.pattern ?? null;
    formField.component =
      fieldConfig.type === "boolean"
        ? "toggle"
        : fieldConfig.type === "string"
        ? "text"
        : fieldConfig.enum
        ? "select"
        : "text";
    formField.placeholder = fieldConfig.examples
      ? fieldConfig.examples[0]
      : null;
    formField.disabled = fieldConfig.disabled ?? false;
    formField.default = fieldConfig.default ?? null;

    formFields.push(formField);
  }

  return formFields;
};
