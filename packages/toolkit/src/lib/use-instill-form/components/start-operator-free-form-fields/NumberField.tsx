import { Form, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../..";
import { FieldHead } from "./FieldHead";

export const NumberField = ({
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
              <Input.Root>
                <Input.Core
                  {...field}
                  type="number"
                  value={field.value ?? ""}
                  autoComplete="off"
                  // AlphaValueIssue: We still have alpha value issue in
                  // out design-token, so we need to use the hex value
                  // here
                  className="nodrag appearance-none !text-[#1D2433] !text-opacity-80 !product-body-text-3-regular"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  disabled={disabled}
                />
              </Input.Root>
            </Form.Control>
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
