import cn from "clsx";
import { Form, Textarea } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../types";
import { FieldDescriptionTooltip } from "../common";

export const TextAreaField = ({
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
              <Textarea
                {...field}
                className={cn(
                  "nodrag nowheel",
                  size === "sm" ? "!product-body-text-4-regular" : ""
                )}
                // At some moment the value maybe a object
                // For example, { foo: { bar: "baz" } }}}. For foo.bar field
                // its value is a string But for foo field its value is a object.
                // And some time the foo field is not a object field but a string field,
                // we need to deal with it
                value={typeof field.value === "object" ? "" : field.value ?? ""}
                autoComplete="off"
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger(path, { shouldFocus: true });
                }}
                disabled={disabled}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
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
