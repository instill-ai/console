import * as React from "react";
import { getReferencesFromString } from "../../../../view";
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
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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

  // The smart hint trigger session
  // When user type the $ and the second {, we will trigger the smart hint
  // When user type the first } we will close the smart hint
  // When user use arrow right and left key we will close the smart hint
  // When user type the $ and then delete it, we will close the smart hint

  if (currentCursorPos) {
    setSmartHintsPopoverIsOpen(true);

    // When the user type the $ and the second {, we will trigger the smart hint
    if (
      event.target.value[currentCursorPos - 2] === "$" &&
      event.target.value[currentCursorPos - 1] === "{"
    ) {
      setSmartHintEnabledPos(currentCursorPos);
      setEnableSmartHints(true);

      // We don't allow second {
      if (
        event.target.value[currentCursorPos - 3] &&
        event.target.value[currentCursorPos - 3] === "{"
      ) {
        setEnableSmartHints(false);
        setSmartHintEnabledPos(null);
      }
    }

    // Process the ending of the reference
    if (event.target.value[currentCursorPos - 1] === "}") {
      const references = getReferencesFromString(event.target.value);
      if (references.length > 0) {
        setEnableSmartHints(false);
        setSmartHintEnabledPos(null);
      }
    }

    // Process when user push backspace
    if (event.target.value[currentCursorPos - 1] === "$") {
      setEnableSmartHints(false);
      setSmartHintEnabledPos(null);
    }
  }

  field.onChange(event);
  setCurrentCursorPos(currentCursorPos);
  form.trigger(path, { shouldFocus: true });
}
