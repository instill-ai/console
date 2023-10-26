import * as React from "react";
import { Form, Icons, Input, Tooltip } from "@instill-ai/design-system";
import { GeneralUseFormReturn } from "../../type";

export const CredentialTextField = ({
  form,
  path,
  title,
  description,
  additionalDescription,
  disabled,
}: {
  form: GeneralUseFormReturn;
  path: string;
  title: string | null;
  description?: string;
  additionalDescription?: string;
  disabled?: boolean;
}) => {
  const [isMasked, setIsMasked] = React.useState(false);

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
              <Input.Root>
                <Input.Core
                  {...field}
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
                />
              </Input.Root>
            </Form.Control>
            <Form.Description>{description}</Form.Description>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
