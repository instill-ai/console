import * as React from "react";
import cn from "clsx";
import { ScrollArea } from "@instill-ai/design-system";
import { SmartHint } from "../../../use-smart-hint";
import { onClickSmartHint } from "./onClickSmartHint";
import { ControllerRenderProps } from "react-hook-form";
import { GeneralUseFormReturn, Nullable } from "../../../type";
import { transformInstillFormatToHumanReadableFormat } from "../../transform";
import { InstillCredit } from "../../../../constant";

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
  instillAcceptFormats,
  supportInstillCredit,
  instillCredential,
}: {
  field: ControllerRenderProps<
    {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
  instillAcceptFormats: string[];
  supportInstillCredit?: boolean;
  instillCredential?: boolean;
}) => {
  const humanReadableAcceptFormatString = React.useMemo(() => {
    const formats = instillAcceptFormats.map((format) => {
      return transformInstillFormatToHumanReadableFormat(format);
    });

    const arrayFormats = formats.filter((f) => f.isArray);
    const nonArrayFormats = formats.filter((f) => !f.isArray);

    const arrayString =
      arrayFormats.length > 0
        ? `Array [${arrayFormats.map((e) => e.format).join(", ")}]`
        : null;
    const nonArrayString =
      nonArrayFormats.length > 0
        ? nonArrayFormats.map((e) => e.format).join(", ")
        : null;

    if (arrayString && nonArrayString) {
      return `${arrayString}, ${nonArrayString}`;
    }

    return arrayString || nonArrayString;
  }, [instillAcceptFormats]);

  return (
    <ScrollArea.Root viewPortRef={smartHintsScrollAreaViewportRef}>
      {enableSmartHints ? (
        <div className="flex h-[224px] flex-col gap-y-2 rounded">
          {filteredHints.length > 0 ? (
            filteredHints.map((hint, index) => {
              return (
                <button
                  key={hint.path}
                  id={`${path.split(".").join("")}-${index}`}
                  className={cn(
                    "flex rounded p-2 text-left product-body-text-4-semibold",
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
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-y-1 rounded border border-semantic-accent-default bg-[#F0F5FF] p-2">
          <p className="text-semantic-accent-default product-body-text-3-semibold">
            {instillCredential
              ? supportInstillCredit
                ? "This configuration support Instill Credit, you can use ${" +
                  InstillCredit.key +
                  "} to reference it"
                : "This configuration didn't support Instill Credit, please reference your own secret"
              : humanReadableAcceptFormatString}
          </p>
        </div>
      )}
    </ScrollArea.Root>
  );
};
