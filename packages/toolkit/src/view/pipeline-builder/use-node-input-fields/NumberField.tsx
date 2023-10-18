import { Form, Input } from "@instill-ai/design-system";
import { GeneralUseFormReturn } from "../../../lib";

export const NumberField = (props: {
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
              <Input.Root>
                <Input.Core
                  {...field}
                  type="number"
                  value={field.value ?? ""}
                  autoComplete="off"
                  // AlphaValueIssue: We still have alpha value issue in
                  // out design-token, so we need to use the hex value
                  // here
                  className="!text-[#1D2433] !text-opacity-80 !product-body-text-3-regular appearance-none"
                />
              </Input.Root>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
