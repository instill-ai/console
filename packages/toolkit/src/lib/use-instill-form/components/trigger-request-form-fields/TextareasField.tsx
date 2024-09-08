"use client";

import * as React from "react";

import { Form, Icons, Textarea } from "@instill-ai/design-system";

import { AutoFormFieldBaseProps } from "../../..";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";
import { FieldHead } from "./FieldHead";

export const TextareasField = ({
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
  const [textareasArray, setTextareasArray] = React.useState<number[]>([1]);

  const [textareasValue, setTextareasValue] = React.useState<
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
              fieldError.filter((e) => e !== undefined || e !== null)[0]
                .message,
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
                <Textarea
                  className="nodrag nowheel !resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-3-regular focus-visible:!ring-1"
                  value={textareasValue[0] ?? undefined}
                  autoComplete="off"
                  onChange={(e) => {
                    const newTextareasValue = [...textareasValue];
                    newTextareasValue[0] = e.target.value;
                    setTextareasValue(newTextareasValue);

                    field.onChange(newTextareasValue);
                  }}
                  disabled={disabled}
                />
              </div>
              {textareasArray.slice(1).map((_, idx) => {
                return (
                  <div
                    key={`${path}-test-${idx}`}
                    className="flex w-full flex-row gap-x-2"
                  >
                    <Textarea
                      className="nodrag nowheel !resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-3-regular focus-visible:!ring-1"
                      value={textareasValue[idx + 1] ?? undefined}
                      autoComplete="off"
                      onChange={(e) => {
                        const newTextareasValue = [...textareasValue];
                        newTextareasValue[idx + 1] = e.target.value;
                        setTextareasValue(newTextareasValue);

                        field.onChange(newTextareasValue);
                      }}
                      disabled={disabled}
                    />

                    {textareasArray.length > 1 ? (
                      <button
                        className="my-auto rounded p-1 hover:bg-semantic-error-bg-alt"
                        type="button"
                        onClick={() => {
                          const newTextareasValue = [...textareasValue];
                          newTextareasValue.splice(idx + 1, 1);
                          setTextareasValue(newTextareasValue);

                          const newTextareasArray = [...textareasArray];
                          newTextareasArray.splice(idx + 1, 1);
                          setTextareasArray(newTextareasArray);

                          field.onChange(newTextareasValue);
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
                  const newTextareasValue = [...textareasValue];
                  newTextareasValue.push(undefined);
                  setTextareasValue(newTextareasValue);

                  const newTextareasArray = [...textareasArray];
                  newTextareasArray.push(1);
                  setTextareasArray(newTextareasArray);

                  field.onChange(newTextareasValue);
                }}
              >
                Add field
              </button>
            </div>
            <Form.Description
              className="nodrag nopan cursor-text select-text !text-xs"
              text={description}
            />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
