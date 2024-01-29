import * as React from "react";
import cn from "clsx";
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";

import {
  GeneralRecord,
  InstillJSONSchema,
  Nullable,
} from "../../../../../../lib";
import { ComponentOutputs } from "../../../ComponentOutputs";
import { ScrollArea } from "@instill-ai/design-system";

export const NodeBottomBarOutput = ({
  componentID,
  outputSchema,
  outputData,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
  outputData: GeneralRecord;
}) => {
  const [mode, setMode] = React.useState<"preview" | "raw">("preview");

  return (
    <div className="flex w-full flex-col p-4">
      <div
        className={cn(
          "mb-2 flex flex-row items-center",
          mode === "raw" ? "justify-between" : "justify-end"
        )}
      >
        {mode === "raw" ? (
          <p className="stroke-semantic-fg-secondary product-body-text-4-semibold">
            Output
          </p>
        ) : null}
        <button
          onClick={() => {
            setMode((prev) => {
              if (prev === "preview") {
                return "raw";
              }
              return "preview";
            });
          }}
          className="rounded px-2 py-0.5 text-semantic-fg-secondary product-body-text-4-medium hover:bg-semantic-bg-base-bg hover:underline"
        >
          {mode}
        </button>
      </div>
      {mode === "preview" ? (
        <ComponentOutputs
          componentID={componentID}
          outputSchema={outputSchema}
          nodeType="connector"
          chooseTitleFrom="title"
        />
      ) : (
        <div className="w-full rounded">
          <ScrollArea.Root
            className="nodrag nowheel h-full"
            viewPortClassName="max-h-[400px] rounded"
          >
            <div className="w-[calc(var(--pipeline-builder-node-available-width)-32px)]">
              <JsonView
                value={outputData}
                style={{
                  ...darkTheme,
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  overflowWrap: "break-word",
                }}
                enableClipboard={false}
                displayObjectSize={false}
                indentWidth={8}
                shortenTextAfterLength={18}
                displayDataTypes={false}
              />
            </div>
          </ScrollArea.Root>
        </div>
      )}
    </div>
  );
};
