"use client";

import cn from "clsx";
import { Form, Select } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../types";
import { FieldDescriptionTooltip } from "../common";

export const SingleSelectField = ({
  form,
  path,
  title,
  options,
  description,
  shortDescription,
  disabled,
  size,
  isHidden,
}: {
  options: string[];
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
                className={size === "sm" ? "!product-body-text-4-medium" : ""}
              >
                {title}
              </Form.Label>
              <FieldDescriptionTooltip description={description} />
            </div>
            <Select.Root
              onValueChange={(e) => {
                field.onChange(e);
              }}
              // Sometime airbyte will put "" in their enum, this will break Radix select
              value={field.value === "" ? undefined : field.value ?? undefined}
              disabled={disabled}
            >
              <Form.Control>
                <Select.Trigger
                  className={cn(
                    "w-full",
                    size === "sm" ? "!product-body-text-4-regular" : ""
                  )}
                >
                  <Select.Value />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {options
                  .filter((e) => e !== "")
                  .map((option) => {
                    return (
                      <Select.Item
                        key={option}
                        value={option}
                        className={cn(
                          "my-auto text-semantic-fg-primary group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary",
                          size === "sm"
                            ? "!product-body-text-4-regular"
                            : "product-body-text-3-regular"
                        )}
                        label={option}
                      />
                    );
                  })}
              </Select.Content>
            </Select.Root>
            <Form.Message
              className={cn(
                "nodrag nopan cursor-text select-text",
                size === "sm" ? "!product-body-text-4-medium" : ""
              )}
            />
            <Form.Message
              className={size === "sm" ? "!product-body-text-4-medium" : ""}
            />
          </Form.Item>
        );
      }}
    />
  );
};
