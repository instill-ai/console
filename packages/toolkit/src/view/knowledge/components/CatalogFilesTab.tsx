import React from "react";

import {
  Button,
  Icons,
  Separator,
  Skeleton,
  Tag,
} from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import {
  useDeleteKnowledgeBaseFile,
  useListKnowledgeBaseFiles,
} from "../../../lib/react-query-service/knowledge";
import { File, KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import FileDetailsOverlay from "./FileDetailsOverlay";
import DeleteFileNotification from "./Notifications/DeleteFileNotification";
import { DELETE_FILE_TIMEOUT } from "./undoDeleteTime";

type CatalogFilesTabProps = {
  knowledgeBase: KnowledgeBase;
};

type FileStatus =
  | "NOTSTARTED"
  | "WAITING"
  | "CONVERTING"
  | "CHUNKING"
  | "EMBEDDING"
  | "COMPLETED"
  | "FAILED";

type TagVariant =
  | "lightNeutral"
  | "lightYellow"
  | "default"
  | "lightGreen"
  | "lightRed";

const getStatusTag = (
  status: FileStatus,
): { variant: TagVariant; dotColor: string } => {
  const statusMap: Record<
    FileStatus,
    { variant: TagVariant; dotColor: string }
  > = {
    NOTSTARTED: {
      variant: "lightNeutral",
      dotColor: "bg-semantic-fg-secondary",
    },
    WAITING: {
      variant: "lightYellow",
      dotColor: "bg-semantic-warning-default",
    },
    CONVERTING: { variant: "default", dotColor: "bg-semantic-accent-default" },
    CHUNKING: { variant: "default", dotColor: "bg-semantic-accent-default" },
    EMBEDDING: { variant: "default", dotColor: "bg-semantic-accent-default" },
    COMPLETED: {
      variant: "lightGreen",
      dotColor: "bg-semantic-success-default",
    },
    FAILED: { variant: "lightRed", dotColor: "bg-semantic-error-default" },
  };
  return statusMap[status] || statusMap.NOTSTARTED;
};

export const CatalogFilesTab: React.FC<CatalogFilesTabProps> = ({
  knowledgeBase,
}) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof File | "";
    direction: "ascending" | "descending" | "";
  }>({
    key: "",
    direction: "",
  });

  const { accessToken, enabledQuery } = useInstillStore(
    useShallow((store: InstillStore) => ({
      accessToken: store.accessToken,
      enabledQuery: store.enabledQuery,
    })),
  );

  const {
    data: files,
    isLoading,
    refetch,
  } = useListKnowledgeBaseFiles({
    ownerId: knowledgeBase.ownerName,
    knowledgeBaseId: knowledgeBase.kbId,
    accessToken,
    enabled: enabledQuery,
  });

  const deleteKnowledgeBaseFile = useDeleteKnowledgeBaseFile();
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<File | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (
      files &&
      files.some(
        (file) => file.processStatus !== "FILE_PROCESS_STATUS_COMPLETED",
      )
    ) {
      interval = setInterval(() => {
        refetch();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [files, refetch]);

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    setIsFileDetailsOpen(true);
  };

  const closeOverlay = () => {
    setSelectedFile(null);
    setIsFileDetailsOpen(false);
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
      if (sortConfig.key === "") return 0;

      let aValue: string | number | Date | boolean = a[sortConfig.key];
      let bValue: string | number | Date | boolean = b[sortConfig.key];

      if (sortConfig.key === "processStatus") {
        aValue = getStatusSortValue(
          a.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus,
        );
        bValue = getStatusSortValue(
          b.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus,
        );
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

  const handleDelete = (fileUid: string) => {
    const file = files?.find((item) => item.fileUid === fileUid);
    if (file) {
      setFileToDelete(file);
      setShowDeleteMessage(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowDeleteMessage(false);
        actuallyDeleteFile(file);
      }, DELETE_FILE_TIMEOUT);
    }
  };

  const actuallyDeleteFile = async (file: File) => {
    try {
      await deleteKnowledgeBaseFile.mutateAsync({
        fileUid: file.fileUid,
        accessToken,
      });
      await refetch();
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setFileToDelete(null);
    }
  };

  const undoDelete = () => {
    setShowDeleteMessage(false);
    setFileToDelete(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const requestSort = (key: keyof File) => {
    let direction: "ascending" | "descending" = "ascending";
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
        {/* <div className="space-x-4">
         <Button variant="secondaryGrey" size="lg">
            Publish
          </Button>
          <Button variant="secondaryGrey" size="lg">
            Update Knowledge Base
          </Button> 
          {!files || files.length === 0 ? (
            null
          ) : (
            <Button variant="primary" size="lg">
              Export Data
            </Button>
          )}
        </div> */}
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
            {isLoading ? (
              <div className="p-8">
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : files && files.length > 0 ? (
              <>
                <div className="grid h-[72px] grid-cols-[3fr_1fr_1fr_1fr_1fr_2fr_1fr] items-center border-b border-semantic-bg-line bg-semantic-bg-base-bg">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-semantic-fg-primary product-body-text-3-medium">
                      File name
                    </div>
                    <Button
                      variant="tertiaryGrey"
                      size="sm"
                      onClick={() => requestSort("name")}
                    >
                      {sortConfig.key === "name" ? (
                        sortConfig.direction === "ascending" ? (
                          <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                        ) : (
                          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                        )
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
                      onClick={() => requestSort("type")}
                    >
                      {sortConfig.key === "type" ? (
                        sortConfig.direction === "ascending" ? (
                          <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                        ) : (
                          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                        )
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
                      onClick={() => requestSort("processStatus")}
                    >
                      {sortConfig.key === "processStatus" ? (
                        sortConfig.direction === "ascending" ? (
                          <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                        ) : (
                          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                        )
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
                      onClick={() => requestSort("size")}
                    >
                      {sortConfig.key === "size" ? (
                        sortConfig.direction === "ascending" ? (
                          <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                        ) : (
                          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                        )
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
                      onClick={() => requestSort("totalChunks")}
                    >
                      {sortConfig.key === "totalChunks" ? (
                        sortConfig.direction === "ascending" ? (
                          <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                        ) : (
                          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                        )
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
                      {sortConfig.key === "createTime" ? (
                        sortConfig.direction === "ascending" ? (
                          <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                        ) : (
                          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                        )
                      ) : (
                        <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-semantic-fg-primary product-body-text-3-medium"></div>
                  </div>
                </div>
                {sortedData
                  .filter((item) => item.fileUid !== fileToDelete?.fileUid)
                  .map((item, index) => (
                    <div
                      key={item.fileUid}
                      className={`grid h-[72px] grid-cols-[3fr_1fr_1fr_1fr_1fr_2fr_1fr] items-center ${index !== sortedData.length - 1
                        ? "border-b border-semantic-bg-line"
                        : ""
                        }`}
                    >
                      <div
                        className="flex items-center justify-center pl-4 text-semantic-bg-secondary-alt-primary product-body-text-3-regula underline underline-offset-1 cursor-pointer truncate"
                        onClick={() => handleFileClick(item)}
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
                          variant={
                            getStatusTag(
                              item.processStatus.replace(
                                "FILE_PROCESS_STATUS_",
                                "",
                              ) as FileStatus,
                            ).variant
                          }
                          className="group relative"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusTag(item.processStatus.replace("FILE_PROCESS_STATUS_", "") as FileStatus).dotColor}`}
                            ></div>
                            {item.processStatus.replace(
                              "FILE_PROCESS_STATUS_",
                              "",
                            )}
                          </div>
                        </Tag>
                      </div>
                      <div className="flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                        {formatFileSize(item.size)}
                      </div>
                      <div className="flex flex-col items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                        <div>{`${item.totalChunks ?? "N/A"} chunks`}</div>
                        {/* <div>{`${item.totalTokens ?? "N/A"} tokens`}</div> */}
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Icons.Gear01 className="h-16 w-16 stroke-semantic-warning-default mb-4" />
                <p className="text-lg font-semibold mb-2">No files found</p>
                <p className="text-semantic-fg-secondary mb-4">
                  Oops... Please upload your files and click the &apos;Process Files&apos;
                  button before returning to this Catalog page to check the
                  progress and results.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    /* Navigate to upload page */
                  }}
                >
                  Go to Upload Documents
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteMessage && fileToDelete ? (
        <DeleteFileNotification
          deletedFileName={fileToDelete.name}
          undoDelete={undoDelete}
          setShowDeleteMessage={setShowDeleteMessage}
        />
      ) : null}
      {selectedFile && (
        <FileDetailsOverlay
          fileUid={selectedFile.fileUid}
          kbId={knowledgeBase.kbId}
          accessToken={accessToken}
          onClose={closeOverlay}
          showFullFile={true}
          ownerId={knowledgeBase.ownerName}
          isOpen={isFileDetailsOpen}
          setIsOpen={setIsFileDetailsOpen}
          fileName={selectedFile.name}
          fileType={selectedFile.type}
        />
      )}
    </div>
  );
};

const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined || isNaN(bytes)) return "N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return bytes + " " + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export default CatalogFilesTab;
