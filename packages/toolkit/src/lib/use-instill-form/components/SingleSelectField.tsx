import {
  Form,
  Icons,
  ParagraphWithHTML,
  Select,
  Tooltip,
} from "@instill-ai/design-system";
import { GeneralUseFormReturn } from "../../type";

export const SingleSelectField = ({
  form,
  path,
  title,
  options,
  description,
  shortDescription,
  disabled,
}: {
  form: GeneralUseFormReturn;
  path: string;
  title: string | null;
  options: string[];
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
            <Form.Description text={shortDescription ?? null} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
