import * as React from "react";
import { Form, Icons, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldRoot } from "./FieldRoot";
import { FieldHead } from "./FieldHead";

export const ImageField = ({
  form,
  path,
  title,
  onEditField,
  onDeleteField,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const [imageFileUrl, setImageFileUrl] =
    React.useState<Nullable<string>>(null);

  return (
    <FieldRoot path={path}>
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
                  className="flex h-[150px] w-full cursor-pointer flex-col rounded border border-dashed border-semantic-bg-line bg-semantic-bg-base-bg"
                >
                  {imageFileUrl ? (
                    <img
                      className="h-full w-full object-contain"
                      src={imageFileUrl}
                      alt={`${path}-image}`}
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
                      id={`op-start-${path}`}
                      type="file"
                      accept="images/*"
                      onChange={async (e) => {
                        if (e.target.files) {
                          const binary = await readFileToBinary(
                            e.target.files[0]
                          );
                          field.onChange(binary);
                          setImageFileUrl(
                            URL.createObjectURL(e.target.files[0])
                          );
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
    </FieldRoot>
  );
};
