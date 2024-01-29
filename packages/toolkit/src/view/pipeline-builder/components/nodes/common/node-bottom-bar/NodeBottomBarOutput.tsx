import * as React from "react";
import cn from "clsx";
import JsonView from "@uiw/react-json-view";
import { customTheme } from "../../../../../../lib/react-json-view";

import {
  GeneralRecord,
  InstillJSONSchema,
  Nullable,
} from "../../../../../../lib";
import { ComponentOutputs } from "../../../ComponentOutputs";

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
          <JsonView
            value={outputData}
            style={{
              ...customTheme,
              padding: "12px",
              borderRadius: "8px",
              fontSize: "12px",
              overflow: "scroll",
              maxHeight: "400px",
            }}
            enableClipboard={false}
            displayObjectSize={false}
            indentWidth={8}
            shortenTextAfterLength={0}
            displayDataTypes={false}
            collapsed={3}
          />
        </div>
      )}
    </div>
  );
};
