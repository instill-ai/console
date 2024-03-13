"use client";

// import JsonView from "@uiw/react-json-view";
import { GeneralRecord, Nullable } from "../../../../../../lib";
import { customTheme } from "../../../../../../lib/react-json-view";
import { CopyToClipboardButton } from "../../../../../../components";

export const NodeBottomBarSchema = ({
  componentSchema,
}: {
  componentSchema: Nullable<GeneralRecord>;
}) => {
  return (
    <div className="relative flex w-full flex-col p-4">
      <CopyToClipboardButton
        className="absolute right-6 top-6 !border-none !bg-transparent"
        iconClassName="!stroke-semantic-bg-primary"
        text={JSON.stringify(componentSchema, null, 2)}
      />
      {/* <JsonView
        value={componentSchema ?? {}}
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
      /> */}
    </div>
  );
};
