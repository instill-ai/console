import * as React from "react";
import { Form, Input, ScrollArea } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, fillArrayWithZeros } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { ImageListItem } from "./ImageListItem";

export const ImagesField = ({
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
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);

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

            <div className="grid w-full grid-flow-row grid-cols-4">
              {imageFiles.length > 0
                ? fillArrayWithZeros(imageFiles, 8)
                    .slice(0, 8)
                    .map((file, i) => {
                      return file ? (
                        <img
                          key={`${path}-${file.name}`}
                          src={URL.createObjectURL(file)}
                          alt={`${path}-${file.name}`}
                          className="h-[55px] object-cover"
                        />
                      ) : (
                        <div
                          key={`${path}-${i}`}
                          className="h-[55px] w-full bg-semantic-bg-secondary"
                        />
                      );
                    })
                : Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`${path}-${i}`}
                      className="h-[55px] w-full bg-semantic-bg-secondary"
                    />
                  ))}
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
                      multiple={true}
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const files: File[] = [];
                          const binaries: string[] = [];
                          for (const file of e.target.files) {
                            const binary = await readFileToBinary(file);
                            files.push(file);
                            binaries.push(binary);
                          }
                          field.onChange(binaries);
                          setImageFiles((prev) => [...prev, ...files]);
                        }
                      }}
                    />
                  </Input.Root>
                </label>
              </Form.Control>
              {imageFiles.length > 0 ? (
                <button
                  type="button"
                  className="flex cursor-pointer rounded-full bg-semantic-error-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-error-default hover:bg-semantic-error-bg-alt"
                  onClick={() => {
                    field.onChange([]);
                    setImageFiles([]);
                  }}
                >
                  Delete all
                </button>
              ) : null}
            </div>
            {imageFiles.length > 0 ? (
              <ScrollArea.Root className="nowheel h-[216px] rounded bg-semantic-bg-secondary p-2">
                <div className="flex h-full flex-col gap-y-2">
                  {imageFiles.map((e, i) => (
                    <ImageListItem
                      key={`${path}-${e.name}-item`}
                      name={e.name}
                      onDelete={() => {
                        const newFiles = imageFiles.filter(
                          (_, index) => index !== i
                        );

                        setImageFiles(newFiles);
                        field.onChange(
                          newFiles.map((file) => {
                            return readFileToBinary(file);
                          })
                        );
                      }}
                    />
                  ))}
                </div>
              </ScrollArea.Root>
            ) : null}
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
