import { AutoCompleteWithIconOption } from "@instill-ai/design-system";

export type FormField = {
  id: string;
  component: "text" | "textarea" | "select" | "toggle";
  type?: "email" | "password" | "text";
  label: string;
  description?: string;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  placeholder: string;
  pattern?: string;
  options?: AutoCompleteWithIconOption[];
  enableCounter?: boolean;
  counterWordLimit?: number;
  default?: string | AutoCompleteWithIconOption;
};
