import * as React from "react";
import cn from "clsx";
import { ScrollArea, Tag } from "@instill-ai/design-system";
import { SmartHint } from "../../../use-smart-hint";
import { onClickSmartHint } from "./onClickSmartHint";
import { ControllerRenderProps } from "react-hook-form";
import { GeneralUseFormReturn, Nullable } from "../../../type";

export const SmartHintList = ({
  form,
  field,
  smartHintsScrollAreaViewportRef,
  enableSmartHints,
  setEnableSmartHints,
  filteredHints,
  path,
  highlightedHintIndex,
  setHighlightedHintIndex,
  inputRef,
  smartHintEnabledPos,
  instillUpstreamTypes,
}: {
  field: ControllerRenderProps<
    {
      [k: string]: any;
    },
    string
  >;
  form: GeneralUseFormReturn;
  smartHintsScrollAreaViewportRef: React.RefObject<HTMLDivElement>;
  enableSmartHints: boolean;
  setEnableSmartHints: React.Dispatch<React.SetStateAction<boolean>>;
  filteredHints: SmartHint[];
  path: string;
  highlightedHintIndex: number;
  setHighlightedHintIndex: React.Dispatch<React.SetStateAction<number>>;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  smartHintEnabledPos: Nullable<number>;
  instillUpstreamTypes: string[];
}) => {
  return (
    <ScrollArea.Root viewPortRef={smartHintsScrollAreaViewportRef}>
      <div
        className={cn(
          "flex !max-h-[224px] flex-col gap-y-2",
          enableSmartHints ? "h-[224px]" : "p-4"
        )}
      >
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
                      form,
                      path,
                      field,
                      smartHint: hint,
                      setEnableSmartHints,
                      inputRef,
                      smartHintEnabledPos,
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
            You can use{" "}
            {instillUpstreamTypes.includes("reference") ? (
              <Tag
                variant="lightBlue"
                size="sm"
                className="!rounded !px-2 !py-0.5"
              >{`{}`}</Tag>
            ) : null}{" "}
            {instillUpstreamTypes.includes("template") ? (
              <>
                or{" "}
                <Tag
                  variant="lightBlue"
                  size="sm"
                  className="!rounded !px-2 !py-0.5"
                >{`{{}}`}</Tag>
              </>
            ) : null}{" "}
            to trigger smart hint
          </p>
        )}
      </div>
    </ScrollArea.Root>
  );
};
