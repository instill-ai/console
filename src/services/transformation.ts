import { SingleSelectOption } from "@instill-ai/design-system";

export type IndependentFormField = {
  kind: "independent" | "dependent";
  id: string;
  component: "text" | "textarea" | "select" | "toggle";
  type?: "email" | "password" | "text";
  title: string;
  description?: string;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  placeholder: string;
  pattern?: string;
  options?: SingleSelectOption[];
  enableCounter?: boolean;
  counterWordLimit?: number;
  default?: string | SingleSelectOption;
  order: number;
  minLength: number;
  maxLength: number;
};

export type DependentFormField = IndependentFormField & {
  dependOnId: string;
  renderCb: (dependOnFieldAnswer: any) => any;
};

export type FormField = DependentFormField | IndependentFormField;

export const isDependentField = (
  field: FormField
): field is DependentFormField => {
  return field && field.kind === "dependent";
};
type Schema = {
  title: string;
  type: string;
  $id: string;
  $schema: string;
  additionalProperties: boolean;
  description: string;
  required: string[];
  properties: Record<string, any>;
  definitions: Record<string, Schema>;
};

export const transformSchemaToFormFields = (
  schema: Schema
): { fields: FormField[]; requiredFields: string[] } => {
  const formFields: FormField[] = [];

  const fullReferenceSchema = deReferenceJsonSchema(schema);

  for (const [fieldName, fieldConfig] of Object.entries(
    fullReferenceSchema.properties
  )) {
    const formField = {} as FormField;

    if (fieldConfig.ui_hidden) {
      continue;
    }

    formField.id = fieldName;
    formField.description = fieldConfig.description ?? null;
    formField.title = fieldConfig.title ?? null;
    formField.type = fieldConfig.type ?? null;
    formField.order = fieldConfig.ui_order ?? null;

    if (fieldConfig.enum) {
      formField.options = (fieldConfig.enum as string[]).map((e, i) => {
        return {
          label: fieldConfig.ui_enum[i] ?? null,
          value: e ?? null,
        };
      });
    }

    formField.required = schema.required.includes(fieldName) ? true : false;
    formField.pattern = fieldConfig.pattern ?? null;
    formField.component = fieldConfig.ui_component ?? null;
    formField.placeholder = fieldConfig.ui_placeholder ?? null;
    formField.disabled = fieldConfig.ui_disabled ?? false;
    formField.default = fieldConfig.default ?? null;
    formFields.push(formField);
  }

  return { fields: formFields, requiredFields: schema.required };
};

/**
 * Handle $ref in Json schema
 * - caveat: this function can't handle external sources
 * - it assumes the format of $ref is "#/definitions/<target>"
 */

export const deReferenceJsonSchema = (schema: Schema) => {
  // Dereference definitions first

  for (const [name, config] of Object.entries(schema.definitions)) {
    for (const [propertyName, propertyConfig] of Object.entries(
      config.properties
    )) {
      if (!propertyConfig.$ref) {
        continue;
      }

      const pathList = (propertyConfig.$ref as string).split("/");
      schema.definitions[name].properties[propertyName] =
        schema.definitions[pathList[2]];
    }
  }

  for (const [name, config] of Object.entries(schema.properties)) {
    if (!config.$ref) {
      continue;
    }

    const pathList = (config.$ref as string).split("/");
    schema.properties = schema.definitions[pathList[2]];
  }

  return schema;
};
