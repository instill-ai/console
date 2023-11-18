import * as React from "react";
import { Form, Input } from "@instill-ai/design-system";
import { GeneralUseFormReturn, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";

export const AudiosField = (props: {
  form: GeneralUseFormReturn;
  fieldKey: string;
  title: string;
}) => {
  const { form, fieldKey, title } = props;
  const [audioFileURLs, setAudioFileURLs] =
    React.useState<Nullable<string[]>>(null);

  return (
    <Form.Field
      key={fieldKey}
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        return (
          <Form.Item className="!w-[232px]">
            <div className="flex flex-row justify-between">
              <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
                {title}
              </Form.Label>
              <label
                htmlFor={`op-start-${fieldKey}`}
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
                  id={`op-start-${fieldKey}`}
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
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
