import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Nullable } from "@instill-ai/toolkit";
import { Form, Icons, Input } from "@instill-ai/design-system";

export const ImageField = (props: {
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  fieldKey: string;
  title: string;
}) => {
  const { form, fieldKey, title } = props;

  const [imageFileUrl, setImageFileUrl] =
    React.useState<Nullable<string>>(null);

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
              <label
                htmlFor={`start-operator-${fieldKey}`}
                className="flex h-[150px] w-full cursor-pointer flex-col rounded bg-semantic-bg-base-bg"
              >
                {imageFileUrl ? (
                  <img
                    className="h-full w-full object-contain"
                    src={imageFileUrl}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
                    <Icons.Upload01 className="h-8 w-8 stroke-semantic-fg-secondary" />
                    <p className="text-semantic-fg-primary product-body-text-4-regular">
                      Upload Image
                    </p>
                  </div>
                )}
                <Input.Root className="hidden">
                  <Input.Core
                    id={`start-operator-${fieldKey}`}
                    type="file"
                    accept="images/*"
                    // DesignToken-AlphaValueIssue:
                    onChange={(e) => {
                      field.onChange(e.target.files ? e.target.files[0] : null);
                      if (e.target.files) {
                        setImageFileUrl(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </Input.Root>
              </label>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
