import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";

import { GeneralUseFormReturn, Nullable } from "../../../type";
import { SmartHint } from "../../../use-smart-hint";

export function onInputKeydown({
  componentType,
  field,
  event,
  path,
  highlightedHintIndex,
  setHighlightedHintIndex,
  filteredHints,
  smartHintsScrollAreaViewportRef,
  inputRef,
  initSmartHintState,
  enableSmartHints,
  setEnableSmartHints,
  smartHintEnabledPos,
}: {
  componentType: "TextField" | "TextArea";
  form: GeneralUseFormReturn;
  field: ControllerRenderProps<
    {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      [k: string]: any;
    },
    string
  >;
  path: string;
  event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>;
  highlightedHintIndex: number;
  setHighlightedHintIndex: React.Dispatch<React.SetStateAction<number>>;
  setEnableSmartHints: React.Dispatch<React.SetStateAction<boolean>>;
  enableSmartHints: boolean;
  filteredHints: SmartHint[];
  smartHintsScrollAreaViewportRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  initSmartHintState: () => void;
  smartHintEnabledPos: Nullable<number>;
}) {
  switch (event.key) {
    case "ArrowDown": {
      if (enableSmartHints) {
        event.preventDefault();
        let newIdx = 0;
        setHighlightedHintIndex((prev) => {
          newIdx = Math.min(prev + 1, filteredHints.length - 1);
          return newIdx;
        });

        smartHintsScrollAreaViewportRef.current
          ?.querySelector(`#${path.split(".").join("")}-${newIdx}`)
          ?.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
      }

      break;
    }
    case "ArrowUp": {
      if (enableSmartHints) {
        event.preventDefault();
        let newIdx = 0;

        setHighlightedHintIndex((prev) => {
          newIdx = Math.max(prev - 1, 0);
          return newIdx;
        });

        smartHintsScrollAreaViewportRef.current
          ?.querySelector(`#${path.split(".").join("")}-${newIdx}`)
          ?.scrollIntoView({ block: "nearest" });
      }

      break;
    }
    case "Enter": {
      if (componentType === "TextField") {
        event.preventDefault();
      }

      if (enableSmartHints) {
        event.preventDefault();

        if (filteredHints.length > 0) {
          if (inputRef.current) {
            const cursorPosition = inputRef.current.selectionStart;
            const value = field.value ?? "";

            let closeBrace = "";

            if (smartHintEnabledPos) {
              if (value[smartHintEnabledPos - 1] === "{") {
                closeBrace = "}";
              }
            }

            const newValue = `${value.slice(0, smartHintEnabledPos)}${
              filteredHints[highlightedHintIndex]?.path
            }${closeBrace}${value.slice(cursorPosition)}`;

            field.onChange(newValue);
            setEnableSmartHints(false);
          }
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
}
