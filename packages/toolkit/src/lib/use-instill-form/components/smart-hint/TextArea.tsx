"use client";

import cn from "clsx";
import * as React from "react";
import { Form, Popover, Textarea } from "@instill-ai/design-system";
import { Nullable } from "../../../type";
import { useInstillStore } from "../../../use-instill-store";

import { useFormContext } from "react-hook-form";
import { SmartHintInfoCard } from "./SmartHintInfoCard";
import { useFilteredHints } from "./useFilteredHints";
import { onInputChange } from "./onInputChange";
import { onInputKeydown } from "./onInputKeydown";
import { SmartHintList } from "./SmartHintList";
import { AutoFormFieldBaseProps, SmartHintWarning } from "../../types";
import { useValidateReferenceAndTemplate } from "./useValidateReferenceAndTemplate";
import { getFieldPlaceholder } from "./getFieldPlaceholder";
import { FieldDescriptionTooltip } from "../common";
import { Secret } from "../../../vdp-sdk";
import { InstillCredit } from "../../../../constant";

export const TextArea = ({
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
  size,
  isHidden,
  secrets,
  instillSecret,
  instillCredential,
  supportInstillCredit,
  updateIsUsingInstillCredit,
}: {
  instillAcceptFormats: string[];
  shortDescription?: string;
  disabled?: boolean;
  isRequired?: boolean;
  instillUpstreamTypes: string[];
  componentID?: string;
  secrets?: Secret[];
  instillSecret?: boolean;
  instillCredential?: boolean;
  supportInstillCredit?: boolean;
  updateIsUsingInstillCredit?: React.Dispatch<React.SetStateAction<boolean>>;
} & AutoFormFieldBaseProps) => {
  const smartHints = useInstillStore((s) => s.smartHints);
  const [smartHintsPopoverIsOpen, setSmartHintsPopoverIsOpen] =
    React.useState(false);
  const [enableSmartHints, setEnableSmartHints] = React.useState(false);
  const [smartHintEnabledPos, setSmartHintEnabledPos] =
    React.useState<Nullable<number>>(null);
  const [currentCursorPos, setCurrentCursorPos] =
    React.useState<Nullable<number>>(null);

  const inputRef = React.useRef<Nullable<HTMLTextAreaElement>>(null);
  const smartHintsScrollAreaViewportRef =
    React.useRef<Nullable<HTMLDivElement>>(null);

  const [highlightedHintIndex, setHighlightedHintIndex] =
    React.useState<number>(0);
  const [smartHintWarning, setSmartHintWarning] =
    React.useState<Nullable<SmartHintWarning>>(null);
  const { getFieldState, formState } = useFormContext();
  const { error } = getFieldState(path, formState);
  const fieldValue = form.getValues(path) as string;

  function initSmartHintState() {
    setEnableSmartHints(false);
    setHighlightedHintIndex(0);
    setSmartHintEnabledPos(null);
    setCurrentCursorPos(null);
  }

  useValidateReferenceAndTemplate({
    hints: smartHints,
    fieldValue,
    setSmartHintWarning,
  });

  const filteredHints = useFilteredHints({
    smartHints,
    instillAcceptFormats,
    currentCursorPos,
    smartHintEnabledPos,
    fieldValue,
    componentID,
    secrets,
    instillSecret,
  });

  const supportTemplate = instillUpstreamTypes.includes("template");
  const supportReference = instillUpstreamTypes.includes("reference");

  const placeholder = React.useMemo(() => {
    return getFieldPlaceholder(instillUpstreamTypes);
  }, [instillUpstreamTypes]);

  const highlightedHint = React.useMemo(() => {
    return filteredHints[highlightedHintIndex];
  }, [filteredHints, highlightedHintIndex]);

  return isHidden ? null : (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="group w-full">
            <div className="flex flex-row gap-x-2">
              <Form.Label
                className={size === "sm" ? "!product-body-text-4-semibold" : ""}
              >
                {isRequired ? `${title} *` : title}
              </Form.Label>
              <FieldDescriptionTooltip description={description} />
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
                  <Textarea
                    {...field}
                    className={cn(
                      "nodrag nowheel placeholder:text-semantic-fg-disabled",
                      size === "sm" ? "!product-body-text-4-regular" : ""
                    )}
                    ref={inputRef}
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
                        setSmartHintEnabledPos,
                        setSmartHintsPopoverIsOpen,
                        updateIsUsingInstillCredit,
                        supportInstillCredit,
                      });
                    }}
                    placeholder={placeholder}
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
                      className="absolute left-0 top-0 w-[var(--radix-popover-trigger-width)] -translate-x-[calc(var(--radix-popover-trigger-width)+10px)] rounded border border-semantic-bg-line bg-semantic-bg-primary shadow-md"
                      error={error}
                      smartHintWarning={smartHintWarning}
                      highlightedHint={highlightedHint}
                      enableSmartHints={enableSmartHints}
                    />
                    <SmartHintList
                      form={form}
                      field={field}
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
                      instillAcceptFormats={instillAcceptFormats}
                      instillCredential={instillCredential}
                      supportInstillCredit={supportInstillCredit}
                    />
                  </React.Fragment>
                ) : null}
              </Popover.Content>
            </Popover.Root>
            <Form.Description
              className={cn(
                "nodrag nopan cursor-text select-text",
                size === "sm" ? "!product-body-text-4-regular" : ""
              )}
              text={
                supportInstillCredit
                  ? `${title} support Instill Credit. You can use Instill Credit by input ` +
                    "${" +
                    `secrets.${InstillCredit.key}` +
                    "}. You can still bring your own key by input ${secrets.your_secret}"
                  : shortDescription ?? null
              }
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
