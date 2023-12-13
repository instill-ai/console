import * as React from "react";
import { extractTemplateReferenceSetFromString } from "../../../../view";
import { ControllerRenderProps } from "react-hook-form";
import { GeneralUseFormReturn, Nullable } from "../../../type";

export function onInputChange({
  field,
  event,
  path,
  form,
  setSmartHintsPopoverIsOpen,
  setEnableSmartHints,
  setSmartHintEnabledPos,
  smartHintEnabledPos,
  setCurrentCursorPos,
}: {
  field: ControllerRenderProps<
    {
      [k: string]: any;
    },
    string
  >;
  form: GeneralUseFormReturn;
  path: string;
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  setSmartHintsPopoverIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEnableSmartHints: React.Dispatch<React.SetStateAction<boolean>>;
  smartHintEnabledPos: Nullable<number>;
  setSmartHintEnabledPos: React.Dispatch<
    React.SetStateAction<Nullable<number>>
  >;
  setCurrentCursorPos: React.Dispatch<React.SetStateAction<Nullable<number>>>;
}) {
  const currentCursorPos = event.target.selectionStart;

  // The smart hint trigger session
  // When user type the first or the second {, we will trigger the smart hint
  // When user type the first } or the second }, we will close the smart hint
  // When user use arrow right and left key we will close the smart hint
  // When user type the first { and then delete it, we will close the smart hint

  if (currentCursorPos) {
    setSmartHintsPopoverIsOpen(true);

    // First {
    if (event.target.value[currentCursorPos - 1] === "{") {
      setSmartHintEnabledPos(currentCursorPos);
      setEnableSmartHints(true);
    }

    // Second {
    if (
      event.target.value[currentCursorPos - 1] === "{" &&
      event.target.value[currentCursorPos - 2] === "{"
    ) {
      setSmartHintEnabledPos(currentCursorPos);
      setEnableSmartHints(true);

      // We don't allow third {
      if (
        event.target.value[currentCursorPos - 3] &&
        event.target.value[currentCursorPos - 3] === "{"
      ) {
        setEnableSmartHints(false);
        setSmartHintEnabledPos(null);
      }
    }

    const isTemplate = smartHintEnabledPos
      ? event.target.value[smartHintEnabledPos - 1] === "}" &&
        event.target.value[smartHintEnabledPos - 2] === "}"
      : false;

    // Process the ending of the reference
    if (event.target.value[currentCursorPos - 1] === "}" && !isTemplate) {
      const referenceSet = extractTemplateReferenceSetFromString(
        event.target.value
      );
      if (referenceSet.singleCurlyBrace.count > 0) {
        setEnableSmartHints(false);
        setSmartHintEnabledPos(null);
      }
    }

    // Process the ending of the template
    if (
      event.target.value[currentCursorPos - 1] === "}" &&
      event.target.value[currentCursorPos - 2] === "}" &&
      isTemplate
    ) {
      const referenceSet = extractTemplateReferenceSetFromString(
        event.target.value
      );
      if (referenceSet.doubleCurlyBrace.count > 0) {
        setEnableSmartHints(false);
        setSmartHintEnabledPos(null);
      }
    }

    // Process user click backspace
    if (event.target.value === "") {
      if (field.value[currentCursorPos - 1] === "{") {
        if (field.value[currentCursorPos - 2] === "{") {
          setSmartHintEnabledPos(currentCursorPos - 1);
        } else {
          setEnableSmartHints(false);
          setSmartHintEnabledPos(null);
        }
      }
    }
  }

  field.onChange(event);
  setCurrentCursorPos(currentCursorPos);
  form.trigger(path, { shouldFocus: true });
}
