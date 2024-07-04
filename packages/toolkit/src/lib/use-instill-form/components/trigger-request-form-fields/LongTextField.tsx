"use client";

import { Form, Textarea } from "@instill-ai/design-system";

import {
  AutoFormFieldBaseProps,
  StartOperatorFreeFormFieldBaseProps,
} from "../../types";
import { FieldHead } from "./FieldHead";

export const LongTextField = ({
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

  return isHidden ? null : (
    <Form.Field
      key={keyPrefix ? `${keyPrefix}-${path}` : path}
      control={form.control}
      name={path}
      render={({ field }) => {
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
            <Form.Control>
              <Textarea
                {...field}
                value={field.value ?? ""}
                className="nodrag resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-3-regular"
                disabled={disabled}
              />
            </Form.Control>
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
