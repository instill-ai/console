import { Form, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../..";
import { FieldHead } from "./FieldHead";

export const TextField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  return isHidden ? null : (
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
              <Input.Root>
                <Input.Core
                  {...field}
                  type="text"
                  value={field.value ?? ""}
                  autoComplete="off"
                  // AlphaValueIssue: We still have alpha value issue in
                  // out design-token, so we need to use the hex value
                  // here
                  className="!text-[#1D2433] !text-opacity-80 !product-body-text-3-regular"
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
