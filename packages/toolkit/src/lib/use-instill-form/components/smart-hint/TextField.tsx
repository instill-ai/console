"use client";

import type { Secret } from "instill-sdk";
import * as React from "react";
import cn from "clsx";
import { useFormContext } from "react-hook-form";

import { Form, Input, Popover } from "@instill-ai/design-system";

import { InstillCredit } from "../../../../constant";
import { Nullable } from "../../../type";
import { useInstillStore } from "../../../use-instill-store";
import { AutoFormFieldBaseProps, SmartHintWarning } from "../../types";
import { FieldDescriptionTooltip } from "../common";
import { getFieldPlaceholder } from "./getFieldPlaceholder";
import { onInputChange } from "./onInputChange";
import { onInputKeydown } from "./onInputKeydown";
import { SmartHintInfoCard } from "./SmartHintInfoCard";
import { SmartHintList } from "./SmartHintList";
import { useFilteredHints } from "./useFilteredHints";
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
    secrets,
    instillSecret,
    supportInstillCredit,
  });

  const supportTemplate = instillUpstreamTypes.includes("template");
  const supportReference = instillUpstreamTypes.includes("reference");

  const placeholder = React.useMemo(() => {
    return getFieldPlaceholder(instillUpstreamTypes);
  }, [instillUpstreamTypes]);

  const highlightedHint = React.useMemo(() => {
    return filteredHints[highlightedHintIndex] ?? null;
  }, [filteredHints, highlightedHintIndex]);

  return isHidden ? null : (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="group w-full">
            {title || shortDescription ? (
              <div className="flex flex-row gap-x-2">
                <Form.Label
                  className={
                    size === "sm" ? "!product-body-text-4-semibold" : ""
                  }
                >
                  {isRequired ? `${title} *` : title}
                </Form.Label>

                <FieldDescriptionTooltip description={description} />
              </div>
            ) : null}
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
                      aria-label={title ?? undefined}
                      ref={(el) => {
                        inputRef.current = el;
                        field.ref(el);
                      }}
                      type="text"
                      value={
                        typeof field.value === "object"
                          ? ""
                          : (field.value ?? "")
                      }
                      className={cn(
                        "nodrag nowheel placeholder:text-semantic-fg-disabled",
                        size === "sm" ? "!product-body-text-4-regular" : "",
                      )}
                      placeholder={placeholder}
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
                      onFocus={() => {
                        setSmartHintsPopoverIsOpen(true);
                      }}
                      onClick={() => {
                        initSmartHintState();
                      }}
                      disabled={disabled}
                      onKeyDown={(e) => {
                        onInputKeydown({
                          componentType: "TextField",
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
                  "relative !w-[var(--radix-popover-trigger-width)] !rounded !p-0",
                )}
                align="end"
              >
                {supportReference || supportTemplate ? (
                  <React.Fragment>
                    <SmartHintInfoCard
                      className="absolute right-0 top-0 w-[var(--radix-popover-trigger-width)] translate-x-[calc(var(--radix-popover-trigger-width)+10px)] rounded border border-semantic-bg-line bg-semantic-bg-primary shadow-md"
                      error={error}
                      smartHintWarning={smartHintWarning}
                      highlightedHint={highlightedHint}
                      enableSmartHints={enableSmartHints}
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
                size === "sm" ? "!product-body-text-4-regular" : "",
              )}
              text={
                supportInstillCredit && instillCredential
                  ? `${title} supports Instill Credit. You can use Instill Credit by input ` +
                    "${" +
                    `secret.${InstillCredit.key}` +
                    "}. You can still bring your own key by input ${secret.your_secret}"
                  : (shortDescription ?? null)
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
