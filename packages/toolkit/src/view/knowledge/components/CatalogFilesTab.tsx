import {
  Button,
  Icons,
  Separator,
  Tag,
  // Textarea,
} from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import * as React from "react";
import { DELETE_FILE_TIMEOUT } from "./undoDeleteTime";
import DeleteFileNotification from "./Notifications/DeleteFileNotification";

type CatalogFilesTabProps = {
  knowledgeBase: KnowledgeBase;
};

type FileStatus = "Not Started" | "Waiting" | "Running" | "Completed" | "Failed";

type TagVariant = "lightNeutral" | "lightYellow" | "default" | "lightGreen" | "lightRed";

const getStatusTag = (status: FileStatus): { variant: TagVariant; dotColor: string } => {
  const statusMap: Record<FileStatus, { variant: TagVariant; dotColor: string }> = {
    "Not Started": { variant: "lightNeutral", dotColor: "bg-[#29AE81]" },
    "Waiting": { variant: "lightYellow", dotColor: "bg-semantic-warning-default" },
    "Running": { variant: "default", dotColor: "bg-semantic-accent-default" },
    "Completed": { variant: "lightGreen", dotColor: "bg-semantic-success-default" },
    "Failed": { variant: "lightRed", dotColor: "bg-semantic-error-default" },
  };
  return statusMap[status] || statusMap["Not Started"];
};

const mockData = [
  {
    fileName: "file-a.pdf",
    fileType: "pdf",
    processedStatus: { chunks: 150, tokens: 28800 },
    createTime: "Today 1:34pm",
    status: "Completed" as FileStatus,
    fileSize: "2.3 MB",
  },
  {
    fileName: "file-b.txt",
    fileType: "txt",
    processedStatus: { chunks: 120, tokens: 21500 },
    createTime: "Today 4:31pm",
    status: "Running" as FileStatus,
    fileSize: "1.1 MB",
  },
  {
    fileName: "file-c.jpg",
    fileType: "jpg",
    processedStatus: { chunks: 2, tokens: 200 },
    createTime: "Today 7:29pm",
    status: "Waiting" as FileStatus,
    fileSize: "3.7 MB",
  },
  {
    fileName: "file-d.png",
    fileType: "png",
    processedStatus: { chunks: 3, tokens: 300 },
    createTime: "Today 11:11pm",
    status: "Not Started" as FileStatus,
    fileSize: "5.2 MB",
  },
  {
    fileName: "file-e.png",
    fileType: "txt",
    processedStatus: { chunks: 3, tokens: 300 },
    createTime: "Today 18:19pm",
    status: "Failed" as FileStatus,
    fileSize: "3.2 MB",
  },
];

export const CatalogFilesTab = ({ knowledgeBase }: CatalogFilesTabProps) => {
  const [sortConfig, setSortConfig] = React.useState({
    key: "",
    direction: "",
  });
  const [data, setData] = React.useState(mockData);
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [deletedFile, setDeletedFile] = React.useState<
    (typeof mockData)[number] | null
  >(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const getStatusSortValue = (status: FileStatus): number => {
    const statusOrder = {
      UNSPECIFIED: 0,
      NOTSTARTED: 1,
      WAITING: 2,
      CONVERTING: 3,
      CHUNKING: 4,
      EMBEDDING: 5,
      COMPLETED: 6,
    };
    return statusOrder[status] ?? -1;
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key === "status") {
      const aValue = getStatusSortValue(a.status);
      const bValue = getStatusSortValue(b.status);
      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }
    if (sortConfig.key === "processedStatus") {
      if (a.processedStatus.chunks !== b.processedStatus.chunks) {
        return sortConfig.direction === "ascending"
          ? a.processedStatus.chunks - b.processedStatus.chunks
          : b.processedStatus.chunks - a.processedStatus.chunks;
      } else {
        return sortConfig.direction === "ascending"
          ? a.processedStatus.tokens - b.processedStatus.tokens
          : b.processedStatus.tokens - a.processedStatus.tokens;
      }
    }
    if (
      a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (
      a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleDelete = (fileName: string) => {
    const fileToDelete = data.find((item) => item.fileName === fileName);
    if (fileToDelete) {
      setDeletedFile(fileToDelete);
      setData((prevData) =>
        prevData.filter((item) => item.fileName !== fileName)
      );
      setShowDeleteMessage(true);
      timeoutRef.current = setTimeout(() => {
        setShowDeleteMessage(false);
        setDeletedFile(null);
      }, DELETE_FILE_TIMEOUT);
    }
  };

  const undoDelete = () => {
    if (deletedFile) {
      setData((prevData) => [...prevData, deletedFile]);
      setShowDeleteMessage(false);
      setDeletedFile(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
        </p>
        {/* Coming in V2 */}
        <div className="space-x-4">
          {/* <Button variant="secondaryGrey" size="lg">
            Publish
          </Button>
          <Button variant="secondaryGrey" size="lg">
            Update Knowledge Base
          </Button> */}
          <Button variant="primary" size="lg">
            Export Data
          </Button>
        </div>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <div className="flex w-full flex-col gap-2">
        {/* <div className="flex justify-start">
          <Button variant={"secondaryGrey"}>
            <Icons.Plus className="w-4 h-4 stroke-semantic-fg-secondary" />
            <div className="text-semantic-fg-primary product-body-text-3-semibold">
              Add File
            </div>
          </Button>
        </div> */}
        <div className="flex rounded border border-semantic-bg-line bg-semantic-bg-primary">
          <div className="flex w-full flex-col">
            <div className="grid h-[72px] grid-cols-[3fr_1fr_1fr_1fr_1fr_2fr_1fr] items-center border-b border-semantic-bg-line bg-semantic-bg-base-bg">
              <div className="flex items-center justify-center gap-1">
                <div className="text-semantic-fg-primary product-body-text-3-medium">
                  File name
                </div>
                <Button
                  variant="tertiaryGrey"
                  size="sm"
                  onClick={() => requestSort("fileName")}
                >
                  {sortConfig.key === "fileName" &&
                    sortConfig.direction === "ascending" ? (
                    <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                  ) : (
                    <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-semantic-fg-primary product-body-text-3-medium">
                  File type
                </div>
                <Button
                  variant="tertiaryGrey"
                  size="sm"
                  onClick={() => requestSort("fileType")}
                >
                  {sortConfig.key === "fileType" &&
                    sortConfig.direction === "ascending" ? (
                    <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                  ) : (
                    <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-semantic-fg-primary product-body-text-3-medium">
                  Status
                </div>
                <Button
                  variant="tertiaryGrey"
                  size="sm"
                  onClick={() => requestSort("status")}
                >
                  {sortConfig.key === "status" &&
                    sortConfig.direction === "ascending" ? (
                    <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                  ) : (
                    <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-semantic-fg-primary product-body-text-3-medium">
                  File size
                </div>
                <Button
                  variant="tertiaryGrey"
                  size="sm"
                  onClick={() => requestSort("fileSize")}
                >
                  {sortConfig.key === "fileSize" &&
                    sortConfig.direction === "ascending" ? (
                    <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                  ) : (
                    <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-nowrap text-semantic-fg-primary product-body-text-3-medium">
                  Processed results
                </div>
                <Button
                  variant="tertiaryGrey"
                  size="sm"
                  onClick={() => requestSort("processedStatus")}
                >
                  {sortConfig.key === "processedStatus" &&
                    sortConfig.direction === "ascending" ? (
                    <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                  ) : (
                    <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                  )}
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
                  {sortConfig.key === "createTime" &&
                    sortConfig.direction === "ascending" ? (
                    <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                  ) : (
                    <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-semantic-fg-primary product-body-text-3-medium"></div>
              </div>
            </div>
            {sortedData.map((item, index) => (
              <div
                key={index}
                className={`grid h-[72px] grid-cols-[3fr_1fr_1fr_1fr_1fr_2fr_1fr] items-center ${index !== sortedData.length - 1
                  ? "border-b border-semantic-bg-line"
                  : ""
                  }`}
              >
                <div className="flex items-center justify-center pl-4 text-semantic-bg-secondary-alt-primary product-body-text-3-regula underline underline-offset-1 cursor-pointer">
                  {item.fileName}
                </div>
                <div className="flex items-center justify-center">
                  <Tag size="sm" variant="lightNeutral">
                    {item.fileType}
                  </Tag>
                </div>
                <div className="flex items-center justify-center">
                  <Tag
                    size="sm"
                    variant={getStatusTag(item.status as FileStatus).variant}
                    className="group relative"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusTag(item.status as FileStatus).dotColor}`}></div>
                      {item.status}
                    </div>
                  </Tag>
                </div>
                <div className="flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  {item.fileSize}
                </div>
                <div className="flex flex-col items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  <div>{`${item.processedStatus.chunks} chunks`}</div>
                  <div>{`${item.processedStatus.tokens} tokens`}</div>
                </div>
                <div className="flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  {item.createTime}
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    variant="tertiaryDanger"
                    size="lg"
                    className="h-8"
                    onClick={() => handleDelete(item.fileName)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="flex w-[375px] flex-col gap-3 border-l border-semantic-bg-line pb-8">
            <div className="flex items-center justify-center gap-3 p-3 pl-3 border-b rounded-tr border-semantic-bg-line bg-semantic-bg-base-bg">
              <div className="text-semantic-fg-primary product-body-text-3-medium">
                Preview
              </div>
            </div>
            <div className="flex flex-col h-full gap-3 px-8">
              <div className="flex flex-col flex-1">
                <div className="flex flex-col h-full gap-1">
                  <div className="flex w-[311px] items-center justify-start pb-2.5">
                    <div className="flex items-start">
                      <div className="product-body-text-3-semibold">
                        File name
                      </div>
                    </div>
                  </div>
                  <Textarea
                    // {...field}
                    // id={field.name}
                    placeholder="Preview"
                    className="flex-1 flex-grow resize-none"
                  />
                </div>
              </div>
              <div className="flex items-start justify-end gap-3">
                <Button
                  variant="secondaryGrey"
                  size="lg"
                  className="capitalize"
                >
                  modify
                </Button>
                <Button
                  variant="secondaryGrey"
                  size="lg"
                  className="capitalize"
                >
                  download
                  <Icons.DownloadCloud01 className="w-4 h-4 ml-2 stroke-semantic-fg-primary" />
                </Button>
              </div>
              <Button
                variant="tertiaryDanger"
                size="lg"
                className="self-end capitalize"
              >
                delete
              </Button>
            </div>
          </div> */}
          {showDeleteMessage && deletedFile ? (
            <DeleteFileNotification
              deletedFileName={deletedFile.fileName}
              undoDelete={undoDelete}
              setShowDeleteMessage={setShowDeleteMessage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
