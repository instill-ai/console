import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { SmartHint } from "../../../use-smart-hint";
import { GeneralUseFormReturn, Nullable } from "../../../type";

export function onClickSmartHint({
  path,
  form,
  inputRef,
  field,
  smartHint,
  setEnableSmartHints,
  smartHintEnabledPos,
}: {
  path: string;
  form: GeneralUseFormReturn;
  inputRef: React.MutableRefObject<
    Nullable<HTMLInputElement | HTMLTextAreaElement>
  >;
  field: ControllerRenderProps<
    {
      [k: string]: any;
    },
    string
  >;
  smartHint: SmartHint;
  setEnableSmartHints: React.Dispatch<React.SetStateAction<boolean>>;
  smartHintEnabledPos: Nullable<number>;
}) {
  if (inputRef.current) {
    const cursorPosition = inputRef.current.selectionStart;
    const value = field.value ?? "";

    let closeBrace = "";

    if (smartHintEnabledPos) {
      if (value[smartHintEnabledPos - 1] === "{") {
        closeBrace = "}";
      }

      if (value[smartHintEnabledPos - 2] === "{") {
        closeBrace = "}}";
      }
    }

    const newValue = `${value.slice(0, smartHintEnabledPos)}${
      smartHint.path
    }${closeBrace}${value.slice(cursorPosition)}`;

    field.onChange(newValue);
    setEnableSmartHints(false);
    form.trigger(path, { shouldFocus: true });
    inputRef.current.focus();
  }
}
