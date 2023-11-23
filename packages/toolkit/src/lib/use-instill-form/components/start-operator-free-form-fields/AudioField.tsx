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
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const [audioFile, setAudioFile] = React.useState<Nullable<File>>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

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

            <div className="flex">
              <Form.Control>
                <UploadFileInput
                  ref={fileRef}
                  title="Upload audio"
                  fieldKey={path}
                  accept="audio/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    console.log(file);
                    if (file) {
                      setAudioFile(file);
                      const binary = await readFileToBinary(file);
                      field.onChange(binary);
                    }
                  }}
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
                  if (fileRef.current) {
                    fileRef.current.value = "";
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
