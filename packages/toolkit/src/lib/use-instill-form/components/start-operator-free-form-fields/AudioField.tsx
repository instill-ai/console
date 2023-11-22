import * as React from "react";
import { Form, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";

export const AudioField = ({
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
  const [audioFileUrl, setAudioFileUrl] =
    React.useState<Nullable<string>>(null);

  return isHidden ? null : (
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
                className="cursor-pointer capitalize text-semantic-accent-default !underline product-button-button-3"
              >
                upload file
              </label>
            </div>

            <audio
              className="w-full"
              controls={true}
              src={audioFileUrl ?? undefined}
            />

            <Form.Control>
              <Input.Root className="hidden">
                <Input.Core
                  id={`op-start-${path}`}
                  type="file"
                  accept="audio/*"
                  onChange={async (e) => {
                    if (e.target.files) {
                      const binary = await readFileToBinary(e.target.files[0]);
                      field.onChange(binary);
                      setAudioFileUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
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
