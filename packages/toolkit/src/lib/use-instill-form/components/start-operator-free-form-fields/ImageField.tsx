import * as React from "react";
import { Form, Icons, Input } from "@instill-ai/design-system";
import { GeneralUseFormReturn, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";

export const ImageField = (props: {
  form: GeneralUseFormReturn;
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
          <Form.Item className="w-full">
            <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
              {title}
            </Form.Label>
            <Form.Control>
              <label
                htmlFor={`op-start-${fieldKey}`}
                className="flex h-[150px] w-full cursor-pointer flex-col rounded border border-dashed border-semantic-bg-line bg-semantic-bg-base-bg"
              >
                {imageFileUrl ? (
                  <img
                    className="h-full w-full object-contain"
                    src={imageFileUrl}
                    alt={`${fieldKey}-image}`}
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
                    id={`op-start-${fieldKey}`}
                    type="file"
                    accept="images/*"
                    onChange={async (e) => {
                      if (e.target.files) {
                        const binary = await readFileToBinary(
                          e.target.files[0]
                        );
                        field.onChange(binary);
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
