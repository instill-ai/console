import cn from "clsx";
import {
  Form,
  Icons,
  ParagraphWithHTML,
  Select,
  Tooltip,
} from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../type";

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
            <Select.Root
              onValueChange={(e) => {
                field.onChange(e);
              }}
              value={field.value ?? undefined}
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
                {options.map((option) => {
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
                    >
                      <p className="my-auto">{option}</p>
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
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
