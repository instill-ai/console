"use client";

import { Form, Icons, Input } from "@instill-ai/design-system";
import * as React from "react";
import { AutoFormFieldBaseProps } from "../../..";
import { FieldHead } from "./FieldHead";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";

export const TextsField = ({
  mode,
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
  disabledReferenceHint,
  instillFormat,
}: StartOperatorFreeFormFieldBaseProps & AutoFormFieldBaseProps) => {
  const [textFieldsArray, setTextFieldsArray] = React.useState<number[]>([1]);

  const [textFieldsValue, setTextFieldsValue] = React.useState<
    (string | undefined)[]
  >([""]);

  return isHidden ? null : (
    <Form.Field
      key={keyPrefix ? `${keyPrefix}-${path}` : path}
      control={form.control}
      name={path}
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
          <Form.Item className="w-full">
            <FieldHead
              mode={mode}
              title={title}
              path={path}
              instillFormat={instillFormat}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              disabledFieldControl={disabledFieldControl}
              disabledReferenceHint={disabledReferenceHint}
            />
            <div className="mb-1.5 flex flex-col space-y-1">
              <div className="w-full">
                <Input.Root className="flex-1">
                  <Input.Core
                    type="text"
                    value={textFieldsValue[0] ?? undefined}
                    autoComplete="off"
                    className="nodrag nowheel text-semantic-fg-primary product-body-text-4-regular"
                    onChange={(e) => {
                      const newTextFieldsValue = [...textFieldsValue];
                      newTextFieldsValue[0] = e.target.value;
                      setTextFieldsValue(newTextFieldsValue);

                      field.onChange(newTextFieldsValue);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    disabled={disabled}
                  />
                </Input.Root>
              </div>
              {textFieldsArray.slice(1).map((_, idx) => {
                return (
                  <div
                    key={`${path}-test-${idx}`}
                    className="flex w-full flex-row gap-x-2"
                  >
                    <Input.Root className="flex-1">
                      <Input.Core
                        type="text"
                        value={textFieldsValue[idx + 1] ?? undefined}
                        autoComplete="off"
                        className="nodrag nowheel text-semantic-fg-primary product-body-text-4-regular"
                        onChange={(e) => {
                          const newTextFieldsValue = [...textFieldsValue];
                          newTextFieldsValue[idx + 1] = e.target.value;
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
                        className="my-auto rounded p-1 hover:bg-semantic-error-bg-alt"
                        type="button"
                        onClick={() => {
                          const newTextFieldsValue = [...textFieldsValue];
                          newTextFieldsValue.splice(idx + 1, 1);
                          setTextFieldsValue(newTextFieldsValue);

                          const newTextFieldsArray = [...textFieldsArray];
                          newTextFieldsArray.splice(idx + 1, 1);
                          setTextFieldsArray(newTextFieldsArray);

                          field.onChange(newTextFieldsValue);
                        }}
                      >
                        <Icons.Trash01 className="h-3 w-3 stroke-semantic-error-on-bg" />
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

            <div className="mb-2 flex">
              <button
                type="button"
                className="flex text-semantic-accent-default !underline product-body-text-4-medium"
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
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
