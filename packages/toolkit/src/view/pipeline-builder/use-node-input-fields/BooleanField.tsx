import { Form, Switch } from "@instill-ai/design-system";
import { GeneralUseFormReturn } from "../../../lib";

export const BooleanField = (props: {
  form: GeneralUseFormReturn;
  fieldKey: string;
  title: string;
}) => {
  const { form, fieldKey, title } = props;
  return (
    <Form.Field
      key={fieldKey}
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
