import cn from "clsx";
import * as React from "react";
import {
  Form,
  Icons,
  Input,
  ParagraphWithHTML,
  Popover,
  ScrollArea,
  Tag,
  Tooltip,
} from "@instill-ai/design-system";
import { GeneralUseFormReturn, Nullable } from "../../../type";
import { useInstillStore } from "../../../use-instill-store";
import {
  SmartHint,
  pickSmartHintsFromAcceptFormats,
} from "../../../use-smart-hint";
import {
  ControllerRenderProps,
  FieldError,
  useFormContext,
} from "react-hook-form";
import { extractTemplateReferenceSetFromString } from "../../../../view";

export const TextField = ({
  form,
  path,
  title,
  description,
  shortDescription,
  disabled,
  instillAcceptFormats,
  isRequired,
  instillUpstreamTypes,
}: {
  form: GeneralUseFormReturn;
  path: string;
  title: string | null;
  instillAcceptFormats: string[];
  description?: string;
  shortDescription?: string;
  disabled?: boolean;
  isRequired?: boolean;
  instillUpstreamTypes: string[];
}) => {
  const smartHints = useInstillStore((s) => s.smartHints);
  const [smartHintsPopoverIsOpen, setSmartHintsPopoverIsOpen] =
    React.useState(false);
  const [enableSmartHints, setEnableSmartHints] = React.useState(false);
  const [smartHintEnabledPos, setSmartHintEnabledPos] =
    React.useState<Nullable<number>>(null);
  const [currentCursorPos, setCurrentCursorPos] =
    React.useState<Nullable<number>>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const smartHintsScrollAreaViewportRef = React.useRef<HTMLDivElement>(null);

  const [highlightedHintIndex, setHighlightedHintIndex] =
    React.useState<number>(0);

  const { getFieldState, formState } = useFormContext();
  const { error } = getFieldState(path, formState);
  const fieldValue = form.getValues(path) as string;

  function initSmartHintState() {
    setEnableSmartHints(false);
    setHighlightedHintIndex(0);
    setSmartHintEnabledPos(null);
    setCurrentCursorPos(null);
  }

  const targetHints: SmartHint[] = React.useMemo(() => {
    if (!smartHints || smartHints.length === 0) {
      return [];
    }

    let searchCode: Nullable<string> = null;

    const allHints = pickSmartHintsFromAcceptFormats(
      smartHints,
      instillAcceptFormats
    );

    if (smartHintEnabledPos && currentCursorPos) {
      searchCode = fieldValue.substring(smartHintEnabledPos, currentCursorPos);

      if (searchCode) {
        return allHints.filter((hint) =>
          hint.path.startsWith(searchCode as string)
        );
      }
    }

    return allHints;
  }, [
    smartHints,
    instillAcceptFormats,
    currentCursorPos,
    smartHintEnabledPos,
    fieldValue,
  ]);

  const supportTemplate = instillUpstreamTypes.includes("template");
  const supportReference = instillUpstreamTypes.includes("reference");

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
              onOpenChange={(open) => {
                initSmartHintState();
                setSmartHintsPopoverIsOpen(open);
              }}
            >
              <Popover.Trigger
                onClick={(e) => {
                  e.preventDefault();
                }}
                asChild
              >
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
                        const currentCursorPos = e.target.selectionStart;

                        if (currentCursorPos) {
                          setSmartHintsPopoverIsOpen(true);

                          // Trigger the smart hint and deal with the filter
                          if (e.target.value[currentCursorPos - 1] === "{") {
                            setEnableSmartHints(true);
                          }

                          // Process the hint filter
                          if (
                            e.target.value[currentCursorPos - 1] !== "{" &&
                            e.target.value[currentCursorPos - 2] === "{"
                          ) {
                            setSmartHintEnabledPos(currentCursorPos - 1);
                          }

                          // Process the ending of the reference and template
                          if (e.target.value[currentCursorPos - 1] === "}") {
                            const referenceSet =
                              extractTemplateReferenceSetFromString(
                                e.target.value
                              );
                            if (
                              referenceSet.doubleCurlyBrace.count > 0 ||
                              referenceSet.singleCurlyBrace.count > 0
                            ) {
                              setEnableSmartHints(false);
                            }
                          }

                          // Process user click backspace
                          if (e.target.value === "") {
                            if (
                              field.value[currentCursorPos - 1] === "{" &&
                              field.value[currentCursorPos - 2] !== "{"
                            ) {
                              setEnableSmartHints(false);
                            }
                          }
                        }

                        field.onChange(e);
                        setCurrentCursorPos(currentCursorPos);
                        form.trigger(path, { shouldFocus: true });
                      }}
                      onFocus={() => {
                        setSmartHintsPopoverIsOpen(true);
                      }}
                      onClick={() => {
                        initSmartHintState();
                      }}
                      disabled={disabled}
                      onKeyDown={(e) => {
                        switch (e.key) {
                          case "ArrowDown": {
                            e.preventDefault();
                            let newIdx = 0;
                            setHighlightedHintIndex((prev) => {
                              newIdx = Math.min(
                                prev + 1,
                                targetHints.length - 1
                              );
                              return newIdx;
                            });

                            smartHintsScrollAreaViewportRef.current
                              ?.querySelector(
                                `#${path.split(".").join("")}-${newIdx}`
                              )
                              ?.scrollIntoView({
                                block: "nearest",
                                behavior: "smooth",
                              });

                            break;
                          }
                          case "ArrowUp": {
                            e.preventDefault();
                            let newIdx = 0;

                            setHighlightedHintIndex((prev) => {
                              newIdx = Math.max(prev - 1, 0);
                              return newIdx;
                            });

                            smartHintsScrollAreaViewportRef.current
                              ?.querySelector(
                                `#${path.split(".").join("")}-${newIdx}`
                              )
                              ?.scrollIntoView({ block: "nearest" });

                            break;
                          }
                          case "Enter": {
                            e.preventDefault();
                            if (targetHints.length > 0 && enableSmartHints) {
                              if (inputRef.current) {
                                const cursorPosition =
                                  inputRef.current.selectionStart;
                                const value = field.value ?? "";
                                const newValue = `${value.slice(
                                  0,
                                  cursorPosition
                                )}${
                                  targetHints[highlightedHintIndex].path
                                }${value.slice(cursorPosition)}`;

                                field.onChange(newValue);
                                setEnableSmartHints(false);
                              }
                            }
                            break;
                          }
                          case "ArrowLeft": {
                            initSmartHintState();
                            break;
                          }
                          case "ArrowRight": {
                            initSmartHintState();
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
                className={cn(
                  "relative !w-[var(--radix-popover-trigger-width)] !rounded !p-0"
                )}
                align="end"
              >
                {supportReference || supportTemplate ? (
                  <React.Fragment>
                    <FieldInformation
                      title={title}
                      field={field}
                      instillAcceptFormats={instillAcceptFormats}
                      isRequired={isRequired}
                      className="absolute left-0 top-0 w-[var(--radix-popover-trigger-width)] -translate-x-[calc(var(--radix-popover-trigger-width)+10px)] rounded border border-semantic-bg-line bg-semantic-bg-primary shadow-md"
                      error={error}
                      supportReference={supportReference}
                      supportTemplate={supportTemplate}
                    />
                    <ScrollArea.Root
                      viewPortRef={smartHintsScrollAreaViewportRef}
                    >
                      <div className="flex !h-[224px] flex-col gap-y-2">
                        {enableSmartHints ? (
                          targetHints.length > 0 ? (
                            targetHints.map((hint, index) => {
                              return (
                                <button
                                  key={hint.path}
                                  id={`${path.split(".").join("")}-${index}`}
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
                                      )}${hint.path}${value.slice(
                                        cursorPosition
                                      )}`;

                                      field.onChange(newValue);
                                      setEnableSmartHints(false);
                                    }
                                  }}
                                  onMouseEnter={() => {
                                    setHighlightedHintIndex(index);
                                  }}
                                >
                                  {hint.path}
                                </button>
                              );
                            })
                          ) : (
                            <p className="m-auto text-semantic-fg-secondary product-body-text-3-semibold">
                              No available hints
                            </p>
                          )
                        ) : (
                          <p className="m-auto text-semantic-fg-secondary product-body-text-3-semibold">
                            No available hints
                          </p>
                        )}
                      </div>
                    </ScrollArea.Root>
                  </React.Fragment>
                ) : (
                  <FieldInformation
                    title={title}
                    field={field}
                    instillAcceptFormats={instillAcceptFormats}
                    isRequired={isRequired}
                    error={error}
                    supportReference={supportReference}
                    supportTemplate={supportTemplate}
                  />
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

const FieldInformation = ({
  title,
  field,
  instillAcceptFormats,
  isRequired,
  className,
  error,
  supportReference,
  supportTemplate,
}: {
  field: ControllerRenderProps<
    {
      [k: string]: any;
    },
    string
  >;
  title: Nullable<string>;
  instillAcceptFormats: string[];
  supportReference: boolean;
  supportTemplate: boolean;
  isRequired?: boolean;
  className?: string;
  error?: FieldError;
}) => {
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="flex flex-col gap-y-4 p-2">
        {isRequired ? (
          <div className="flex flex-row gap-x-2">
            {field.value && field.value !== "" ? (
              <Icons.CheckCircle className="my-auto h-4 w-4 stroke-semantic-success-default" />
            ) : (
              <Icons.AlertCircle className="my-auto h-4 w-4 stroke-semantic-warning-default" />
            )}

            <p
              className={cn(
                "my-auto product-body-text-3-semibold",
                field.value && field.value !== ""
                  ? "text-semantic-success-default"
                  : "text-semantic-warning-default"
              )}
            >
              required
            </p>
          </div>
        ) : null}
        {instillAcceptFormats.length > 0 ? (
          <div className="flex flex-row gap-x-2">
            <div className="pt-0.5">
              <Icons.HelpCircle className="mb-auto h-4 w-4 stroke-semantic-fg-secondary" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-semantic-fg-secondary product-body-text-3-semibold">
                This field accept following formats:
              </p>
              <div className="flex flex-row flex-wrap gap-x-2">
                {instillAcceptFormats.map((format) => (
                  <Tag
                    key={format}
                    variant="lightBlue"
                    size="sm"
                    className="!rounded !px-2 !py-0.5"
                  >
                    {format}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {supportReference ? (
          <div className="flex flex-row gap-x-2">
            <div className="pt-0.5">
              <Icons.HelpCircle className="mb-auto h-4 w-4 stroke-semantic-fg-secondary" />
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="m-auto text-semantic-fg-secondary product-body-text-3-semibold">
                This field support reference, you can use {` `}
                <Tag
                  variant="lightBlue"
                  size="sm"
                  className="!rounded !px-2 !py-0.5"
                >{`{}`}</Tag>{" "}
                to reference other value. For example:
              </p>
              <p className="rounded border border-semantic-bg-line bg-semantic-bg-base-bg px-2 py-1 text-semantic-fg-secondary product-body-text-3-regular">
                {`{start.${title}}`}
              </p>
            </div>
          </div>
        ) : null}
        {supportTemplate ? (
          <div className="flex flex-row gap-x-2">
            <div className="pt-0.5">
              <Icons.HelpCircle className="mb-auto h-4 w-4 stroke-semantic-fg-secondary" />
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="m-auto text-semantic-fg-secondary product-body-text-3-semibold">
                This field support template, you can use {` `}
                <Tag
                  variant="lightBlue"
                  size="sm"
                  className="!rounded !px-2 !py-0.5"
                >{`{{}}`}</Tag>{" "}
                to compose your template. For example:
              </p>
              <p className="rounded border border-semantic-bg-line bg-semantic-bg-base-bg px-2 py-1 text-semantic-fg-secondary product-body-text-3-regular">
                {`This is a template, {{start.${title}}}`}
              </p>
            </div>
          </div>
        ) : null}
      </div>
      {error ? (
        <div className="flex w-full flex-col gap-y-1 bg-semantic-error-bg p-2">
          <p className="text-semantic-error-default product-body-text-3-semibold">
            Field error
          </p>
          <p className="text-semantic-error-default product-body-text-3-regular">
            {String(error.message)}
          </p>
        </div>
      ) : null}
    </div>
  );
};
