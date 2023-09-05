import { UseFormReturn } from "react-hook-form";
import { Form, Switch } from "@instill-ai/design-system";

export const BooleanField = (props: {
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  fieldKey: string;
  title: string;
}) => {
  const { form, fieldKey, title } = props;
  return (
    <Form.Field
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
              {title}
            </Form.Label>
            <Form.Control>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
