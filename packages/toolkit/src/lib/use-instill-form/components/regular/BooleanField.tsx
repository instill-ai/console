"use client";

import cn from "clsx";
import { Form, Switch } from "@instill-ai/design-system";
import type { AutoFormFieldBaseProps } from "../../types";
import { FieldDescriptionTooltip } from "../common";

export const BooleanField = ({
  form,
  path,
  title,
  description,
  shortDescription,
  disabled,
  size,
  isHidden,
}: {
  shortDescription?: string;
  disabled?: boolean;
} & AutoFormFieldBaseProps) => {
  return isHidden ? null : (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item>
            <div className="flex flex-row gap-x-2">
              <Form.Label
                className={size === "sm" ? "!product-body-text-4-semibold" : ""}
              >
                {title}
              </Form.Label>
              <FieldDescriptionTooltip description={description} />
            </div>
            <Form.Control>
              <Switch
                checked={field.value}
                onCheckedChange={(e) => {
                  field.onChange(e);
                  form.trigger(path, { shouldFocus: true });
                }}
                disabled={disabled}
              />
            </Form.Control>

            <Form.Description
              className={cn(
                "nodrag nopan cursor-text select-text",
                size === "sm" ? "!product-body-text-4-regular" : ""
              )}
              text={shortDescription ?? null}
            />
            <Form.Message
              className={cn(
                "nodrag nopan cursor-text select-text",
                size === "sm" ? "!product-body-text-4-medium" : ""
              )}
            />
          </Form.Item>
        );
      }}
    />
  );
};
