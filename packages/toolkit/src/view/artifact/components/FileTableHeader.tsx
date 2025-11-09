import { File } from "instill-sdk";

import { Button, Icons } from "@instill-ai/design-system";

type FileTableHeaderProps = {
  sortConfig: {
    key: keyof File | "";
    direction: "ascending" | "descending" | "";
  };
  requestSort: (key: keyof File) => void;
};

export const FileTableHeader = ({
  sortConfig,
  requestSort,
}: FileTableHeaderProps) => {
  const renderSortIcon = (key: keyof File) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <Icons.ChevronUp className="w-4 h-4 stroke-semantic-bg-secondary-alt-primary" />
      ) : (
        <Icons.ChevronDown className="w-4 h-4 stroke-semantic-bg-secondary-alt-primary" />
      );
    }
    return (
      <Icons.ChevronDown className="w-4 h-4 stroke-semantic-bg-secondary-alt-primary" />
    );
  };

  return (
    <div
      className="grid h-[72px] items-center border-b border-semantic-bg-line bg-semantic-bg-base-bg border rounded"
      style={{
        gridTemplateColumns: "minmax(0, 3fr) 1fr 1fr 1fr 1fr 2fr 1fr",
      }}
    >
      <div className="flex items-center justify-center gap-1 px-4">
        <div className="text-semantic-fg-primary product-body-text-3-medium truncate max-w-[200px]">
          File name
        </div>
        <Button
          variant="tertiaryGrey"
          size="sm"
          onClick={() => requestSort("name")}
        >
          {renderSortIcon("name")}
        </Button>
      </div>
      <div className="flex items-center justify-center gap-1">
        <div className="text-semantic-fg-primary product-body-text-3-medium">
          File type
        </div>
        <Button
          variant="tertiaryGrey"
          size="sm"
          onClick={() => requestSort("type")}
        >
          {renderSortIcon("type")}
        </Button>
      </div>
      <div className="flex items-center justify-center gap-1">
        <div className="text-semantic-fg-primary product-body-text-3-medium">
          Status
        </div>
        <Button
          variant="tertiaryGrey"
          size="sm"
          onClick={() => requestSort("processStatus")}
        >
          {renderSortIcon("processStatus")}
        </Button>
      </div>
      <div className="flex items-center justify-center gap-1">
        <div className="text-semantic-fg-primary product-body-text-3-medium">
          File size
        </div>
        <Button
          variant="tertiaryGrey"
          size="sm"
          onClick={() => requestSort("size")}
        >
          {renderSortIcon("size")}
        </Button>
      </div>
      <div className="flex items-center justify-center gap-1">
        <div className="text-nowrap text-semantic-fg-primary product-body-text-3-medium">
          Processed results
        </div>
        <Button
          variant="tertiaryGrey"
          size="sm"
          onClick={() => requestSort("totalChunks")}
        >
          {renderSortIcon("totalChunks")}
        </Button>
      </div>
      <div className="flex items-center justify-center gap-1">
        <div className="text-semantic-fg-primary product-body-text-3-medium">
          Create time
        </div>
        <Button
          variant="tertiaryGrey"
          size="sm"
          onClick={() => requestSort("createTime")}
        >
          {renderSortIcon("createTime")}
        </Button>
      </div>
      <div className="flex items-center justify-center gap-1">
        <div className="text-semantic-fg-primary product-body-text-3-medium"></div>
      </div>
    </div>
  );
};
