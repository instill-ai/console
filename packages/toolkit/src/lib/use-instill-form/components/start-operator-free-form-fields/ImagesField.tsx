import * as React from "react";
import { Form, Icons, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";

export const ImagesField = ({
  form,
  path,
  title,
  onEditField,
  onDeleteField,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const [imageFileURLs, setImageFileURLs] =
    React.useState<Nullable<string[]>>(null);

  return (
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
              <label
                htmlFor={`op-start-${path}`}
                className="flex min-h-[150px] w-full cursor-pointer flex-col rounded border border-dashed border-semantic-bg-line bg-semantic-bg-base-bg"
              >
                {imageFileURLs ? (
                  <div className="grid h-full w-full grid-flow-row grid-cols-3">
                    {imageFileURLs
                      .slice(0, 5)
                      .map((url) =>
                        url ? (
                          <img
                            key={`${path}-${url}`}
                            src={url}
                            alt={`${path}-${url}`}
                            className="h-[55px] object-cover"
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
                    id={`op-start-${path}`}
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
