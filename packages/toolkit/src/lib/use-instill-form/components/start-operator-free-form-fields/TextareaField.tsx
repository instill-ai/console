import { Form, Textarea } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../..";
import { FieldHead } from "./FieldHead";

export const TextareaField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
  disabled,
  keyPrefix,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  return isHidden ? null : (
    <Form.Field
      key={keyPrefix ? `${keyPrefix}-${path}` : path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="w-full">
            <FieldHead
              form={form}
              title={title}
              path={path}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              disabled={disabled}
            />
            <Form.Control>
              <Textarea
                {...field}
                value={field.value ?? ""}
                autoComplete="off"
                className="nodrag !resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-3-regular focus-visible:!ring-1"
                disabled={disabled}
              />
            </Form.Control>
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
