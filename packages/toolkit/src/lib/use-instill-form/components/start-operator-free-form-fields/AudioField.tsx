import * as React from "react";
import { Form } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { UploadFileInput } from "./UploadFileInput";
import { AudioListItem } from "./AudioListItem";

export const AudioField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
  disabled,
  keyPrefix,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const [audioFile, setAudioFile] = React.useState<Nullable<File>>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return isHidden ? null : (
    <Form.Field
      key={keyPrefix ? `${keyPrefix}-${path}` : path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="w-full">
            <FieldHead
              form={form}
              title={title}
              path={path}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              disabled={disabled}
            />

            <div className="flex">
              <Form.Control>
                <UploadFileInput
                  ref={inputRef}
                  title="Upload audio"
                  fieldKey={path}
                  accept="audio/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAudioFile(file);
                      const binary = await readFileToBinary(file);
                      field.onChange(binary);
                    }
                  }}
                  disabled={disabled}
                />
              </Form.Control>
            </div>
            {audioFile ? (
              <AudioListItem
                src={URL.createObjectURL(audioFile)}
                name={audioFile.name}
                onDelete={() => {
                  setAudioFile(null);
                  field.onChange(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
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
