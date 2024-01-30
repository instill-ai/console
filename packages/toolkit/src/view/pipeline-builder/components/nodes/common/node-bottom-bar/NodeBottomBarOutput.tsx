import * as React from "react";
import JsonView from "@uiw/react-json-view";
import { customTheme } from "../../../../../../lib/react-json-view";

import {
  GeneralRecord,
  InstillJSONSchema,
  Nullable,
} from "../../../../../../lib";
import { ComponentOutputs } from "../../../ComponentOutputs";
import { CopyToClipboardButton } from "../../../../../../components";

export const NodeBottomBarOutput = ({
  componentID,
  outputSchema,
  outputData,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
  outputData: Nullable<GeneralRecord>;
}) => {
  const [mode, setMode] = React.useState<"preview" | "raw">("preview");

  return (
    <div className="flex w-full flex-col p-4">
      <div className="mb-2 flex flex-row items-center justify-end">
        <button
          onClick={() => {
            setMode((prev) => {
              if (prev === "preview") {
                return "raw";
              }
              return "preview";
            });
          }}
          className="rounded px-2 py-0.5 text-semantic-fg-secondary !underline product-body-text-4-medium hover:text-semantic-fg-primary"
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
          <p className="mb-2 text-semantic-fg-secondary product-body-text-4-medium">
            Output
          </p>
          <div className="relative w-full">
            {outputData ? (
              <CopyToClipboardButton
                className="absolute right-3 top-3 !border-none !bg-transparent"
                iconClassName="!stroke-semantic-bg-primary"
                text={JSON.stringify(outputData, null, 2)}
              />
            ) : null}
            <JsonView
              value={outputData ?? {}}
              style={{
                ...customTheme,
                padding: "12px",
                borderRadius: "8px",
                fontSize: "12px",
                overflow: "auto",
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
        </div>
      )}
    </div>
  );
};
