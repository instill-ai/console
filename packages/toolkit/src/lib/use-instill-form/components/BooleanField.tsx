import { Form, Icons, Switch, Tooltip } from "@instill-ai/design-system";
import { GeneralUseFormReturn } from "../../type";

export const BooleanField = ({
  form,
  path,
  title,
  description,
  shortDescription,
  disabled,
}: {
  form: GeneralUseFormReturn;
  path: string;
  title: null | string;
  description?: string;
  shortDescription?: string;
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
                          <p className="break-all text-semantic-fg-primary product-body-text-4-semibold">
                            {description}
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
            <Form.Message />
            <Form.Description>{shortDescription}</Form.Description>
          </Form.Item>
        );
      }}
    />
  );
};
