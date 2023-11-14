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
import { GeneralUseFormReturn, Nullable } from "../../../type";
import { useInstillStore } from "../../../use-instill-store";

import { useFormContext } from "react-hook-form";
import { SmartHintInfoCard } from "./SmartHintInfoCard";
import { useFilteredHints } from "./useFilteredHints";
import { onInputChange } from "./onInputChange";
import { onInputKeydown } from "./onInputKeydown";
import { SmartHintList } from "./SmartHintList";
import { SmartHintWarning } from "../../type";
import { useValidateReferenceAndTemplate } from "./useValidateReferenceAndTemplate";

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
  componentID,
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
  componentID?: string;
}) => {
  const smartHints = useInstillStore((s) => s.smartHints);
  const [smartHintsPopoverIsOpen, setSmartHintsPopoverIsOpen] =
    React.useState(false);
  const [enableSmartHints, setEnableSmartHints] = React.useState(false);
  const [smartHintEnabledPos, setSmartHintEnabledPos] =
    React.useState<Nullable<number>>(null);
  const [currentCursorPos, setCurrentCursorPos] =
    React.useState<Nullable<number>>(null);
  const inputRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const smartHintsScrollAreaViewportRef =
    React.useRef<Nullable<HTMLDivElement>>(null);
  const [highlightedHintIndex, setHighlightedHintIndex] =
    React.useState<number>(0);
  const [smartHintWarning, setSmartHintWarning] =
    React.useState<Nullable<SmartHintWarning>>(null);

  const { getFieldState, formState } = useFormContext();
  const { error } = getFieldState(path, formState);
  const fieldValue = form.getValues(path) as string;

  useValidateReferenceAndTemplate({
    hints: smartHints,
    fieldValue,
    setSmartHintWarning,
  });

  function initSmartHintState() {
    setEnableSmartHints(false);
    setHighlightedHintIndex(0);
    setSmartHintEnabledPos(null);
    setCurrentCursorPos(null);
  }

  const filteredHints = useFilteredHints({
    smartHints,
    instillAcceptFormats,
    currentCursorPos,
    smartHintEnabledPos,
    fieldValue,
    componentID,
  });

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
                        onInputChange({
                          event: e,
                          field,
                          form,
                          path,
                          setEnableSmartHints,
                          setCurrentCursorPos,
                          smartHintEnabledPos,
                          setSmartHintEnabledPos,
                          setSmartHintsPopoverIsOpen,
                        });
                      }}
                      onFocus={() => {
                        setSmartHintsPopoverIsOpen(true);
                      }}
                      onClick={() => {
                        initSmartHintState();
                      }}
                      disabled={disabled}
                      onKeyDown={(e) => {
                        onInputKeydown({
                          event: e,
                          form,
                          field,
                          path,
                          setEnableSmartHints,
                          enableSmartHints,
                          initSmartHintState,
                          filteredHints,
                          highlightedHintIndex,
                          setHighlightedHintIndex,
                          inputRef,
                          smartHintsScrollAreaViewportRef,
                          smartHintEnabledPos,
                        });
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
                    <SmartHintInfoCard
                      title={title}
                      field={field}
                      instillAcceptFormats={instillAcceptFormats}
                      isRequired={isRequired}
                      className="absolute left-0 top-0 w-[var(--radix-popover-trigger-width)] -translate-x-[calc(var(--radix-popover-trigger-width)+10px)] rounded border border-semantic-bg-line bg-semantic-bg-primary shadow-md"
                      error={error}
                      supportReference={supportReference}
                      supportTemplate={supportTemplate}
                      smartHintWarning={smartHintWarning}
                    />
                    <SmartHintList
                      field={field}
                      form={form}
                      smartHintsScrollAreaViewportRef={
                        smartHintsScrollAreaViewportRef
                      }
                      enableSmartHints={enableSmartHints}
                      setEnableSmartHints={setEnableSmartHints}
                      filteredHints={filteredHints}
                      path={path}
                      highlightedHintIndex={highlightedHintIndex}
                      setHighlightedHintIndex={setHighlightedHintIndex}
                      inputRef={inputRef}
                      smartHintEnabledPos={smartHintEnabledPos}
                      instillUpstreamTypes={instillUpstreamTypes}
                    />
                  </React.Fragment>
                ) : (
                  <SmartHintInfoCard
                    title={title}
                    field={field}
                    instillAcceptFormats={instillAcceptFormats}
                    isRequired={isRequired}
                    error={error}
                    supportReference={supportReference}
                    supportTemplate={supportTemplate}
                    smartHintWarning={smartHintWarning}
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
