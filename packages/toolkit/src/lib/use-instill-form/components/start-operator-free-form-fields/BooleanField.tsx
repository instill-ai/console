import { Form, Switch } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../type";
import { FieldHead } from "./FieldHead";

export const BooleanField = ({
  form,
  path,
  title,
  description,
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
          <Form.Item>
            <FieldHead
              title={title}
              path={path}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
            />
            <Form.Control>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </Form.Control>
            <Form.Description text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
