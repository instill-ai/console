"use client";

import cn from "clsx";
import * as React from "react";
import { Form, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../types";
import { FieldDescriptionTooltip } from "../common";

export const CredentialTextField = ({
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
  const [isMasked, setIsMasked] = React.useState(false);

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
              <Input.Root>
                <Input.Core
                  {...field}
                  className={cn(
                    "nodrag nowheel",
                    size === "sm" ? "!product-body-text-4-regular" : ""
                  )}
                  type="text"
                  value={
                    typeof field.value === "object" ? "" : field.value ?? ""
                  }
                  autoComplete="off"
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger(path, { shouldFocus: true });
                  }}
                  disabled={disabled}
                  onFocus={() => {
                    if (field.value === "*****MASK*****") {
                      setIsMasked(true);
                      field.onChange("");
                    }
                  }}
                  onBlur={() => {
                    if (field.value === "" && isMasked) {
                      field.onChange("*****MASK*****");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </Input.Root>
            </Form.Control>
            <Form.Description
              className={size === "sm" ? "!product-body-text-4-regular" : ""}
              text={shortDescription ?? null}
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
