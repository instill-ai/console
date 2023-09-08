import * as React from "react";
import { Nullable } from "@instill-ai/toolkit";
import { Form, Input } from "@instill-ai/design-system";
import { readFileToBinary } from "pipeline-builder/lib";
import { GeneralUseFormReturn } from "pipeline-builder/type";

export const AudioField = (props: {
  form: GeneralUseFormReturn;
  fieldKey: string;
  title: string;
}) => {
  const { form, fieldKey, title } = props;
  const [audioFileUrl, setAudioFileUrl] =
    React.useState<Nullable<string>>(null);

  return (
    <Form.Field
      key={fieldKey}
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        return (
          <Form.Item>
            <div className="flex flex-row justify-between">
              <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
                {title}
              </Form.Label>
              <label
                htmlFor={`start-operator-${fieldKey}`}
                className="cursor-pointer capitalize text-semantic-accent-default !underline product-button-button-3"
              >
                upload file
              </label>
            </div>

            <audio controls={true} src={audioFileUrl ?? undefined} />

            <Form.Control>
              <Input.Root className="hidden">
                <Input.Core
                  id={`start-operator-${fieldKey}`}
                  type="file"
                  accept="audio/*"
                  // DesignToken-AlphaValueIssue:
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
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
