import { Form, Input, Textarea } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../..";
import { FieldHead } from "./FieldHead";

export const TextareaField = ({
  form,
  path,
  title,
  onEditField,
  onDeleteField,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  return (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="w-full">
            <FieldHead
              title={title}
              path={path}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
            />
            <Form.Control>
              <Textarea
                {...field}
                value={field.value ?? ""}
                autoComplete="off"
                // AlphaValueIssue: We still have alpha value issue in
                // out design-token, so we need to use the hex value
                // here
                className="!resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-3-regular focus-visible:!ring-1"
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
