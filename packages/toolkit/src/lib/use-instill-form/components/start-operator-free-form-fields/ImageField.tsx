import * as React from "react";
import { Form, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { ImageListItem } from "./ImageListItem";

export const ImageField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const [imageFile, setImageFile] = React.useState<Nullable<File>>();

  return isHidden ? null : (
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

            <div className="w-full">
              {imageFile ? (
                <img
                  key={`${path}-${imageFile.name}`}
                  src={URL.createObjectURL(imageFile)}
                  alt={`${path}-${imageFile.name}`}
                  className="h-[150px] w-full object-cover"
                />
              ) : (
                <div
                  key={`${path}-image-placeholder`}
                  className="h-[150px] w-full bg-semantic-bg-secondary"
                />
              )}
            </div>
            <div className="flex flex-row gap-x-1">
              <Form.Control>
                <label
                  htmlFor={`op-start-${path}`}
                  className="flex cursor-pointer rounded-full bg-semantic-accent-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default hover:bg-semantic-accent-bg-alt"
                >
                  Upload image
                  <Input.Root className="hidden">
                    <Input.Core
                      id={`op-start-${path}`}
                      type="file"
                      accept="images/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const binary = await readFileToBinary(file);
                          field.onChange(binary);
                          setImageFile(file);
                        }
                      }}
                    />
                  </Input.Root>
                </label>
              </Form.Control>
            </div>
            {imageFile ? (
              <ImageListItem
                name={imageFile.name}
                onDelete={() => {
                  setImageFile(null);
                  field.onChange(null);
                }}
              />
            ) : null}
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
