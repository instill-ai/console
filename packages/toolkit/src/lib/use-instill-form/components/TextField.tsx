import cn from "clsx";
import * as React from "react";
import {
  Form,
  Icons,
  Input,
  ParagraphWithHTML,
  Popover,
  Tooltip,
} from "@instill-ai/design-system";
import { GeneralUseFormReturn, Nullable } from "../../type";
import { useInstillStore } from "../../use-instill-store";
import {
  SmartHint,
  pickSmartHintsFromAcceptFormats,
} from "../../use-smart-hint";

export const TextField = ({
  form,
  path,
  title,
  description,
  shortDescription,
  disabled,
  instillAcceptFormats,
  isRequired,
}: {
  form: GeneralUseFormReturn;
  path: string;
  title: string | null;
  description?: string;
  shortDescription?: string;
  disabled?: boolean;
  instillAcceptFormats: string[];
  isRequired?: boolean;
  type: string;
}) => {
  const smartHints = useInstillStore((s) => s.smartHints);
  const [smartHintsPopoverIsOpen, setSmartHintsPopoverIsOpen] =
    React.useState(false);
  const [isUsingCurlyBraces, setIsUsingCurlyBraces] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [highlightedHintIndex, setHighlightedHintIndex] =
    React.useState<number>(0);

  const targetHints: SmartHint[] = React.useMemo(() => {
    if (!smartHints || smartHints.length === 0) {
      return [];
    }

    console.log(smartHints, instillAcceptFormats);

    return pickSmartHintsFromAcceptFormats(smartHints, instillAcceptFormats);
  }, [smartHints, instillAcceptFormats]);

  return (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="w-full">
            <div className="flex flex-row gap-x-2">
              <Form.Label>{isRequired ? `${title} *` : title}</Form.Label>
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
            <Popover.Root
              open={smartHintsPopoverIsOpen}
              onOpenChange={(open) => setSmartHintsPopoverIsOpen(open)}
            >
              <Popover.Trigger asChild>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      ref={inputRef}
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
                      onKeyDown={(e) => {
                        switch (e.key) {
                          case "ArrowDown": {
                            e.preventDefault();
                            setHighlightedHintIndex((prev) => {
                              return Math.min(prev + 1, targetHints.length - 1);
                            });
                            break;
                          }
                          case "ArrowUp": {
                            e.preventDefault();
                            setHighlightedHintIndex((prev) => {
                              return Math.max(prev - 1, 0);
                            });
                            break;
                          }
                          case "Enter": {
                            e.preventDefault();
                            if (targetHints.length > 0) {
                              if (inputRef.current) {
                                const cursorPosition =
                                  inputRef.current.selectionStart;
                                const value = field.value ?? "";
                                const newValue = `${value.slice(
                                  0,
                                  cursorPosition
                                )}${
                                  smartHints[highlightedHintIndex].path
                                }${value.slice(cursorPosition)}`;

                                field.onChange(newValue);
                                setSmartHintsPopoverIsOpen(false);
                              }
                            }
                            break;
                          }
                        }
                      }}
                    />
                  </Input.Root>
                </Form.Control>
              </Popover.Trigger>
              <Popover.Content
                // Popover will auto-focus the content, we need to disable it
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                }}
                className="!w-[var(--radix-popover-trigger-width)] !p-0"
              >
                {targetHints.length > 0 ? (
                  <React.Fragment>
                    <div className="flex flex-col gap-y-2">
                      {targetHints.map((hint, index) => {
                        return (
                          <button
                            key={hint.path}
                            className={cn(
                              "flex rounded p-2 product-body-text-4-semibold",
                              {
                                "bg-semantic-accent-bg text-semantic-accent-hover":
                                  highlightedHintIndex === index,
                              }
                            )}
                            onClick={() => {
                              if (inputRef.current) {
                                const cursorPosition =
                                  inputRef.current.selectionStart;
                                const value = field.value ?? "";
                                const newValue = `${value.slice(
                                  0,
                                  cursorPosition
                                )}${hint.path}${value.slice(cursorPosition)}`;

                                field.onChange(newValue);
                                setSmartHintsPopoverIsOpen(false);
                              }
                            }}
                            onMouseEnter={() => {
                              setHighlightedHintIndex(index);
                            }}
                          >
                            {hint.path}
                          </button>
                        );
                      })}
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="p-2">
                    {isRequired ? (
                      <div className="flex flex-row gap-x-2">
                        <Icons.CheckCircle className="my-auto h-3 w-3 stroke-semantic-success-default" />
                        <p className="my-auto text-semantic-fg-secondary product-body-text-4-semibold">
                          required
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </Popover.Content>
            </Popover.Root>

            <Form.Description text={shortDescription ?? null} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
