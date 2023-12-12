import * as React from "react";
import { Form, ScrollArea } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { UploadFileInput } from "./UploadFileInput";
import { AudioListItem } from "./AudioListItem";
import { StartOperatorFreeFormFieldBaseProps } from "./types";

export const AudiosField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
  disabled,
  keyPrefix,
  disabledFieldControl,
}: StartOperatorFreeFormFieldBaseProps & AutoFormFieldBaseProps) => {
  const [audioFiles, setAudioFiles] = React.useState<File[]>([]);
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
              disabledFieldControl={disabledFieldControl}
            />

            <div className="flex flex-row gap-x-1">
              <Form.Control>
                <UploadFileInput
                  ref={inputRef}
                  keyPrefix={keyPrefix}
                  title="Upload audios"
                  fieldKey={path}
                  accept="audio/*"
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
                      setAudioFiles((prev) => [...prev, ...files]);
                    }
                  }}
                  disabled={disabled}
                />
              </Form.Control>
              {audioFiles.length > 0 ? (
                <button
                  type="button"
                  className="flex cursor-pointer rounded-full bg-semantic-error-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-error-default hover:bg-semantic-error-bg-alt"
                  onClick={() => {
                    field.onChange([]);
                    setAudioFiles([]);

                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  Delete all
                </button>
              ) : null}
            </div>
            {audioFiles.length > 0 ? (
              <ScrollArea.Root className="nowheel h-[216px] rounded bg-semantic-bg-secondary p-2">
                <div className="flex h-full flex-col gap-y-2">
                  {audioFiles.map((e, i) => (
                    <AudioListItem
                      key={`${path}-${e.name}-item`}
                      name={e.name}
                      src={URL.createObjectURL(e)}
                      onDelete={() => {
                        const newFiles = audioFiles.filter(
                          (_, index) => index !== i
                        );

                        setAudioFiles(newFiles);
                        field.onChange(
                          newFiles.map((file) => {
                            return readFileToBinary(file);
                          })
                        );

                        // We directly remove the browser input value, we don't need it
                        // and it may cause some surprise when user reupload the same file
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
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
