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
