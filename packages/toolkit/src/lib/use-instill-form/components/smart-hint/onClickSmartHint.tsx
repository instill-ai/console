import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { SmartHint } from "../../../use-smart-hint";
import { Nullable } from "../../../type";

export function onClickSmartHint({
  inputRef,
  field,
  smartHint,
  setEnableSmartHints,
  smartHintEnabledPos,
}: {
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

    const newValue = `${value.slice(0, smartHintEnabledPos ?? 0 + 1)}${
      smartHint.path
    }${value.slice(cursorPosition)}`;

    field.onChange(newValue);
    setEnableSmartHints(false);
    inputRef.current.focus();
  }
}
