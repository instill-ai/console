import { Form, Icons, Switch, Tooltip } from "@instill-ai/design-system";
import { GeneralUseFormReturn } from "../../type";

export const BooleanField = ({
  form,
  path,
  title,
  description,
  additionalDescription,
  disabled,
}: {
  form: GeneralUseFormReturn;
  path: string;
  title: null | string;
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
            <Form.Description>{description}</Form.Description>
          </Form.Item>
        );
      }}
    />
  );
};
