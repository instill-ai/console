import JsonView from "@uiw/react-json-view";
import { GeneralRecord, Nullable } from "../../../../../../lib";
import { customTheme } from "../../../../../../lib/react-json-view";

export const NodeBottomBarSchema = ({
  componentSchema,
}: {
  componentSchema: Nullable<GeneralRecord>;
}) => {
  return (
    <div className="flex w-full flex-col p-4">
      <JsonView
        value={componentSchema ?? {}}
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
  );
};
