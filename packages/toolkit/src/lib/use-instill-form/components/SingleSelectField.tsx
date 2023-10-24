import { Form, Icons, Select, Tooltip } from "@instill-ai/design-system";
import { GeneralUseFormReturn } from "../../type";

export const SingleSelectField = ({
  form,
  path,
  title,
  options,
  description,
  additionalDescription,
  disabled,
}: {
  form: GeneralUseFormReturn;
  path: string;
  title: string | null;
  options: string[];
  description?: string;
  additionalDescription?: string;
  disabled?: boolean;
}) => {
  return (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item>
            <div className="flex flex-row gap-x-2">
              <Form.Label>{title}</Form.Label>
              {additionalDescription ? (
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Icons.HelpCircle className="w-[14px] my-auto cursor-pointer h-[14px] stroke-semantic-fg-secondary" />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="w-[360px]"
                        sideOffset={5}
                        side="top"
                      >
                        <div className="!px-3 !py-2 !rounded-sm !bg-semantic-bg-primary">
                          <p className="product-body-text-4-semibold break-all text-semantic-fg-primary">
                            {additionalDescription}
                          </p>
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
                <Select.Trigger className="w-full">
                  <Select.Value />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {options.map((option) => {
                  return (
                    <Select.Item
                      key={option}
                      value={option}
                      className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                    >
                      <p className="my-auto">{option}</p>
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select.Root>
            <Form.Description>{description}</Form.Description>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
