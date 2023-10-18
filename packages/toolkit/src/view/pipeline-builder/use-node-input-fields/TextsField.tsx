import { Form, Icons, Input } from "@instill-ai/design-system";
import * as React from "react";
import { GeneralUseFormReturn } from "../../../lib";

export const TextsField = (props: {
  form: GeneralUseFormReturn;
  fieldKey: string;
  title: string;
}) => {
  const [textFieldsArray, setTextFieldsArray] = React.useState<number[]>([1]);

  const [textFieldsValue, setTextFieldsValue] = React.useState<
    (string | undefined)[]
  >([""]);

  const { form, fieldKey, title } = props;
  return (
    <Form.Field
      key={fieldKey}
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        const {
          formState: { errors },
        } = form;

        let targetError: string | undefined;

        const fieldError = errors[field.name];

        if (fieldError) {
          if (Array.isArray(fieldError)) {
            targetError = String(
              fieldError.filter((e) => e !== undefined || e !== null)[0].message
            );
          } else {
            targetError = String(fieldError.message);
          }
        } else {
          targetError = undefined;
        }

        return (
          <div className="flex flex-col">
            <Form.Label className="mb-1 text-semantic-fg-primary product-body-text-3-semibold">
              {title}
            </Form.Label>
            <div className="mb-1.5 flex flex-col space-y-1">
              {textFieldsArray.map((_, idx) => {
                return (
                  <div
                    key={`${fieldKey}-test-${idx}`}
                    className="flex w-full flex-row gap-x-2"
                  >
                    <Input.Root className="flex-1">
                      <Input.Core
                        type="text"
                        value={textFieldsValue[idx] ?? undefined}
                        autoComplete="off"
                        className="text-semantic-fg-primary product-body-text-4-regular"
                        onChange={(e) => {
                          const newTextFieldsValue = [...textFieldsValue];
                          newTextFieldsValue[idx] = e.target.value;
                          setTextFieldsValue(newTextFieldsValue);

                          field.onChange(newTextFieldsValue);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Input.Root>
                    {textFieldsArray.length > 1 ? (
                      <button
                        type="button"
                        className="my-auto flex h-6 w-6 flex-shrink-0 rounded border border-semantic-bg-line hover:border-semantic-fg-secondary"
                        onClick={() => {
                          const newTextFieldsValue = [...textFieldsValue];
                          newTextFieldsValue.splice(idx, 1);
                          setTextFieldsValue(newTextFieldsValue);

                          const newTextFieldsArray = [...textFieldsArray];
                          newTextFieldsArray.splice(idx, 1);
                          setTextFieldsArray(newTextFieldsArray);

                          field.onChange(newTextFieldsValue);
                        }}
                      >
                        <Icons.X className="m-auto h-4 w-4 stroke-semantic-fg-secondary" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {targetError ? (
              <p className="mb-3 text-semantic-error-default !product-body-text-4-regular">
                {targetError}
              </p>
            ) : null}

            <div className="flex">
              <button
                type="button"
                className="flex text-semantic-accent-default !underline product-button-button-3"
                onClick={() => {
                  const newTextFieldsValue = [...textFieldsValue];
                  newTextFieldsValue.push(undefined);
                  setTextFieldsValue(newTextFieldsValue);

                  const newTextFieldsArray = [...textFieldsArray];
                  newTextFieldsArray.push(1);
                  setTextFieldsArray(newTextFieldsArray);

                  field.onChange(newTextFieldsValue);
                }}
              >
                Add field
              </button>
            </div>
          </div>
        );
      }}
    />
  );
};
