import * as React from "react";
import { Form, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";

export const AudiosField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const [audioFileURLs, setAudioFileURLs] =
    React.useState<Nullable<string[]>>(null);

  return (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="w-full">
            <div className="flex flex-row justify-between">
              <FieldHead
                title={title}
                path={path}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
              />
              <label
                htmlFor={`op-start-${path}`}
                className="my-auto cursor-pointer text-center capitalize text-semantic-accent-default !underline product-button-button-3"
              >
                upload files
              </label>
            </div>

            <div className="flex flex-col gap-y-2">
              {audioFileURLs?.map((url) => (
                <audio
                  key={url}
                  className="w-[232px]"
                  controls={true}
                  src={url}
                />
              ))}
            </div>

            <Form.Control>
              <Input.Root className="hidden">
                <Input.Core
                  id={`op-start-${path}`}
                  type="file"
                  accept="audio/*"
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
                      setAudioFileURLs(urls);
                    }
                  }}
                  multiple={true}
                />
              </Input.Root>
            </Form.Control>
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
