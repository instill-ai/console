import * as React from "react";
import cn from "clsx";
import { ScrollArea } from "@instill-ai/design-system";
import { SmartHint } from "../../../use-smart-hint";
import { onClickSmartHint } from "./onClickSmartHint";
import { ControllerRenderProps } from "react-hook-form";

export const SmartHintList = ({
  field,
  smartHintsScrollAreaViewportRef,
  enableSmartHints,
  setEnableSmartHints,
  filteredHints,
  path,
  highlightedHintIndex,
  setHighlightedHintIndex,
  inputRef,
}: {
  field: ControllerRenderProps<
    {
      [k: string]: any;
    },
    string
  >;
  smartHintsScrollAreaViewportRef: React.RefObject<HTMLDivElement>;
  enableSmartHints: boolean;
  setEnableSmartHints: React.Dispatch<React.SetStateAction<boolean>>;
  filteredHints: SmartHint[];
  path: string;
  highlightedHintIndex: number;
  setHighlightedHintIndex: React.Dispatch<React.SetStateAction<number>>;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}) => {
  return (
    <ScrollArea.Root viewPortRef={smartHintsScrollAreaViewportRef}>
      <div className="flex !h-[224px] flex-col gap-y-2">
        {enableSmartHints ? (
          filteredHints.length > 0 ? (
            filteredHints.map((hint, index) => {
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
                    onClickSmartHint({
                      field,
                      smartHint: hint,
                      setEnableSmartHints,
                      inputRef,
                    });
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
  );
};
