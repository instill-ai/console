"use client";

import { Form, Switch } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../types";
import { FieldHead } from "./FieldHead";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";

export const BooleanField = ({
  mode,
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
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
              <Switch
                checked={field.value}
                onCheckedChange={(e) => {
                  field.onChange(e);
                }}
              />
            </Form.Control>
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
