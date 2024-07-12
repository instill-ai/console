// CatalogFilesTab.tsx

import {
  Button,
  Icons,
  Separator,
  Tag,
} from "@instill-ai/design-system";
import { KnowledgeBase, File } from "../../../lib/vdp-sdk/knowledge/types";
import * as React from "react";
import { DELETE_FILE_TIMEOUT } from "./undoDeleteTime";
import DeleteFileNotification from "./Notifications/DeleteFileNotification";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import { useListKnowledgeBaseFiles, useDeleteKnowledgeBaseFile, useGetFileDetails } from "../../../lib/react-query-service/knowledge";
import FileDetailsOverlay from "./FileDetailsOverlay";

type CatalogFilesTabProps = {
  knowledgeBase: KnowledgeBase;
};

type FileStatus = "NOTSTARTED" | "WAITING" | "CONVERTING" | "CHUNKING" | "EMBEDDING" | "COMPLETED" | "FAILED";

type TagVariant = "lightNeutral" | "lightYellow" | "default" | "lightGreen" | "lightRed";

const getStatusTag = (status: FileStatus): { variant: TagVariant; dotColor: string } => {
  const statusMap: Record<FileStatus, { variant: TagVariant; dotColor: string }> = {
    NOTSTARTED: { variant: "lightNeutral", dotColor: "bg-semantic-fg-secondary" },
    WAITING: { variant: "lightYellow", dotColor: "bg-semantic-warning-default" },
    CONVERTING: { variant: "default", dotColor: "bg-semantic-accent-default" },
    CHUNKING: { variant: "default", dotColor: "bg-semantic-accent-default" },
    EMBEDDING: { variant: "default", dotColor: "bg-semantic-accent-default" },
    COMPLETED: { variant: "lightGreen", dotColor: "bg-semantic-success-default" },
    FAILED: { variant: "lightRed", dotColor: "bg-semantic-error-default" },
  };
  return statusMap[status] || statusMap.NOTSTARTED;
};

export const CatalogFilesTab = ({ knowledgeBase }: CatalogFilesTabProps) => {
  const [sortConfig, setSortConfig] = React.useState({
    key: "",
    direction: "",
  });
  const { accessToken, enabledQuery } = useInstillStore(
    useShallow((store: InstillStore) => ({
      accessToken: store.accessToken,
      enabledQuery: store.enabledQuery,
    }))
  );
  const { data: files, isLoading } = useListKnowledgeBaseFiles({
    ownerId: knowledgeBase.ownerName,
    knowledgeBaseId: knowledgeBase.kbId,
    accessToken,
    enabled: enabledQuery,
  });
  const deleteKnowledgeBaseFile = useDeleteKnowledgeBaseFile();
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [deletedFile, setDeletedFile] = React.useState<File | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [selectedFileUid, setSelectedFileUid] = React.useState<string | null>(null);


  const handleFileClick = (fileUid: string) => {
    setSelectedFileUid(fileUid);
  };

  const closeOverlay = () => {
    setSelectedFileUid(null);
  };
  const getStatusSortValue = (status: FileStatus): number => {
    const statusOrder = {
      NOTSTARTED: 0,
      WAITING: 1,
      CONVERTING: 2,
      CHUNKING: 3,
      EMBEDDING: 4,
      COMPLETED: 5,
      FAILED: 6,
    };
    return statusOrder[status] ?? -1;
  };

  const sortedData = React.useMemo(() => {
    if (!files) return [];
    return [...files].sort((a, b) => {
      if (sortConfig.key === "processStatus") {
        const aValue = getStatusSortValue(a.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus);
        const bValue = getStatusSortValue(b.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus);
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }
      if (sortConfig.key === "size" || sortConfig.key === "totalChunks" || sortConfig.key === "totalTokens") {
        return sortConfig.direction === "ascending"
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      if (
        a[sortConfig.key as keyof File] < b[sortConfig.key as keyof File]
      ) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (
        a[sortConfig.key as keyof File] > b[sortConfig.key as keyof File]
      ) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [files, sortConfig]);

  const handleDelete = async (fileUid: string) => {
    const fileToDelete = files?.find((item) => item.fileUid === fileUid);
    if (fileToDelete) {
      setDeletedFile(fileToDelete);
      try {
        await deleteKnowledgeBaseFile.mutateAsync({
          fileUid,
          accessToken,
        });
        setShowDeleteMessage(true);
        timeoutRef.current = setTimeout(() => {
          setShowDeleteMessage(false);
          setDeletedFile(null);
        }, DELETE_FILE_TIMEOUT);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const undoDelete = () => {
    if (deletedFile) {
      // Implement undo delete logic here
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
                key={item.fileUid}
                className={`grid h-[72px] grid-cols-[3fr_1fr_1fr_1fr_1fr_2fr_1fr] items-center ${index !== sortedData.length - 1 ? "border-b border-semantic-bg-line" : ""
                  }`}
              >
                <div className="flex items-center justify-center pl-4 text-semantic-bg-secondary-alt-primary product-body-text-3-regula underline underline-offset-1 cursor-pointer truncate"
                  onClick={() => handleFileClick(item.fileUid)}
                >
                  {item.name}
                </div>
                <div className="flex items-center justify-center">
                  <Tag size="sm" variant="lightNeutral">
                    {item.type.replace("FILE_TYPE_", "")}
                  </Tag>
                </div>
                <div className="flex items-center justify-center">
                  <Tag
                    size="sm"
                    variant={getStatusTag(item.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus).variant}
                    className="group relative"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusTag(item.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus).dotColor}`}></div>
                      {item.processStatus.replace("FILE_PROCESS_STATUS_", "")}
                    </div>
                  </Tag>
                </div>
                <div className="flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  {formatFileSize(item.size)}
                </div>
                <div className="flex flex-col items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  <div>{`${item.totalChunks ?? 'N/A'} chunks`}</div>
                  <div>{`${item.totalTokens ?? 'N/A'} tokens`}</div>
                </div>
                <div className="flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  {formatDate(item.createTime)}
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    variant="tertiaryDanger"
                    size="lg"
                    className="h-8"
                    onClick={() => handleDelete(item.fileUid)}
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
              deletedFileName={deletedFile.name}
              undoDelete={undoDelete}
              setShowDeleteMessage={setShowDeleteMessage}
            />
          ) : null}
          {selectedFileUid && (
            <FileDetailsOverlay
              fileUid={selectedFileUid}
              kbId={knowledgeBase.kbId}
              onClose={closeOverlay}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined || isNaN(bytes)) return 'N/A';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}