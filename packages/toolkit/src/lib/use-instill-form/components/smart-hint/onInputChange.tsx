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
  setSmartHintEnabledPos: React.Dispatch<
    React.SetStateAction<Nullable<number>>
  >;
  setCurrentCursorPos: React.Dispatch<React.SetStateAction<Nullable<number>>>;
}) {
  const currentCursorPos = event.target.selectionStart;

  if (currentCursorPos) {
    setSmartHintsPopoverIsOpen(true);

    // Trigger the smart hint and deal with the filter
    if (event.target.value[currentCursorPos - 1] === "{") {
      setEnableSmartHints(true);
    }

    // Process the hint filter
    if (
      event.target.value[currentCursorPos - 1] !== "{" &&
      event.target.value[currentCursorPos - 2] === "{"
    ) {
      setSmartHintEnabledPos(currentCursorPos - 1);
    }

    // Process the ending of the reference and template
    if (event.target.value[currentCursorPos - 1] === "}") {
      const referenceSet = extractTemplateReferenceSetFromString(
        event.target.value
      );
      if (
        referenceSet.doubleCurlyBrace.count > 0 ||
        referenceSet.singleCurlyBrace.count > 0
      ) {
        setEnableSmartHints(false);
      }
    }

    // Process user click backspace
    if (event.target.value === "") {
      if (
        field.value[currentCursorPos - 1] === "{" &&
        field.value[currentCursorPos - 2] !== "{"
      ) {
        setEnableSmartHints(false);
      }
    }
  }

  field.onChange(event);
  setCurrentCursorPos(currentCursorPos);
  form.trigger(path, { shouldFocus: true });
}
