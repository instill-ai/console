import {
  Form,
  Icons,
  ParagraphWithHTML,
  Textarea,
  Tooltip,
} from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../type";

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
              {description ? (
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Icons.HelpCircle className="my-auto h-[14px] w-[14px] cursor-pointer stroke-semantic-fg-secondary" />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="w-[360px]"
                        sideOffset={5}
                        side="top"
                      >
                        <div className="!rounded-sm !bg-semantic-bg-primary !px-3 !py-2">
                          <ParagraphWithHTML
                            text={description}
                            className="break-all text-semantic-fg-primary product-body-text-4-semibold"
                          />
                        </div>
                        <Tooltip.Arrow
                          className="fill-white"
                          offset={5}
                          width={9}
                          height={6}
                        />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ) : null}
            </div>
            <Form.Control>
              <Textarea
                {...field}
                className={size === "sm" ? "!product-body-text-4-regular" : ""}
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
