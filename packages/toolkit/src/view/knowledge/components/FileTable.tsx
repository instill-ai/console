import React from "react";

import {
  File,
  FileStatus,
} from "../../../lib/react-query-service/knowledge/types";
import { FileTableHeader } from "./FileTableHeader";
import { FileTableRow } from "./FileTableRow";
import { getStatusSortValue } from "./lib/helpers";

type FileTableProps = {
  files: File[];
  sortConfig: {
    key: keyof File | "";
    direction: "ascending" | "descending" | "";
  };
  requestSort: (key: keyof File) => void;
  handleDelete: (fileUid: string) => void;
  handleFileClick: (file: File) => void;
};

export const FileTable = ({
  files,
  sortConfig,
  requestSort,
  handleDelete,
  handleFileClick,
}: FileTableProps) => {
  const sortedData = React.useMemo(() => {
    if (!files) return [];
    return [...files].sort((a, b) => {
      if (sortConfig.key === "") return 0;

      let aValue: string | number | Date | boolean = a[sortConfig.key];
      let bValue: string | number | Date | boolean = b[sortConfig.key];

      if (sortConfig.key === "processStatus") {
        aValue = getStatusSortValue(a.processStatus as FileStatus);
        bValue = getStatusSortValue(b.processStatus as FileStatus);
      } else if (
        sortConfig.key === "size" ||
        sortConfig.key === "totalChunks" ||
        sortConfig.key === "totalTokens"
      ) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortConfig.key === "createTime") {
        aValue = new Date(aValue as string);
        bValue = new Date(bValue as string);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [files, sortConfig]);

  return (
    <div className="flex flex-col">
      <FileTableHeader sortConfig={sortConfig} requestSort={requestSort} />
      {sortedData.map((item, index) => (
        <FileTableRow
          key={item.fileUid}
          item={item}
          index={index}
          handleFileClick={handleFileClick}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};
