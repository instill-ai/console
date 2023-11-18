/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as React from "react";
import { Form, Icons, Input } from "@instill-ai/design-system";
import { GeneralUseFormReturn, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";

export const ImagesField = (props: {
  form: GeneralUseFormReturn;
  fieldKey: string;
  title: string;
}) => {
  const { form, fieldKey, title } = props;

  const [imageFileURLs, setImageFileURLs] =
    React.useState<Nullable<string[]>>(null);

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
                className="flex min-h-[150px] w-full cursor-pointer flex-col rounded border border-dashed border-semantic-bg-line bg-semantic-bg-base-bg"
              >
                {imageFileURLs ? (
                  <div className="grid w-full grid-flow-row grid-cols-3">
                    {imageFileURLs
                      .slice(0, 5)
                      .map((url) =>
                        url ? (
                          <img
                            key={`${fieldKey}-${url}`}
                            src={url}
                            alt={`${fieldKey}-${url}`}
                            className="h-[55px] object-contain"
                          />
                        ) : null
                      )}
                  </div>
                ) : (
                  <div className="my-auto flex h-full w-full flex-col items-center justify-center gap-y-2">
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
                    multiple={true}
                    // DesignToken-AlphaValueIssue:
                    onChange={async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const urls: string[] = [];
                        const binaries: string[] = [];
                        for (const file of e.target.files) {
                          const binary = await readFileToBinary(file);
                          urls.push(URL.createObjectURL(file));
                          binaries.push(binary);
                        }
                        field.onChange(binaries);
                        setImageFileURLs(urls);
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
