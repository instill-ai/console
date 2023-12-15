import { Form, Switch } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../type";
import { FieldHead } from "./FieldHead";
import { StartOperatorFreeFormFieldBaseProps } from "./types";

export const BooleanField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
  keyPrefix,
  disabledFieldControl,
}: StartOperatorFreeFormFieldBaseProps & AutoFormFieldBaseProps) => {
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
              disabledFieldControl={disabledFieldControl}
            />
            <Form.Control>
              <Switch
                checked={field.value}
                onCheckedChange={(e) => {
                  console.log(e);
                  field.onChange(e);
                }}
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
