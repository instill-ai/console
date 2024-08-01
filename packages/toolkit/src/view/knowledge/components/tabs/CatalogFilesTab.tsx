import React from "react";

import { Separator, Skeleton } from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import {
  useDeleteKnowledgeBaseFile,
  useListKnowledgeBaseFiles,
} from "../../../../lib/react-query-service/knowledge";
import {
  File,
  KnowledgeBase,
} from "../../../../lib/react-query-service/knowledge/types";
import EmptyState from "../EmptyState";
import FileDetailsOverlay from "../FileDetailsOverlay";
import { FileTable } from "../FileTable";
import { DELETE_FILE_TIMEOUT } from "../lib/undoDeleteTime";
import { DeleteFileNotification } from "../notifications";

type CatalogFilesTabProps = {
  knowledgeBase: KnowledgeBase;
  onGoToUpload: () => void;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const CatalogFilesTab = ({
  knowledgeBase,
  onGoToUpload,
}: CatalogFilesTabProps) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof File | "";
    direction: "ascending" | "descending" | "";
  }>({
    key: "",
    direction: "",
  });

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const {
    data: files,
    isLoading,
    refetch,
  } = useListKnowledgeBaseFiles({
    namespaceId: me.data?.id ?? null,
    knowledgeBaseId: knowledgeBase.catalogId,
    accessToken,
    enabled: enabledQuery && Boolean(me.data?.id),
  });

  const deleteKnowledgeBaseFile = useDeleteKnowledgeBaseFile();
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<File | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // This effect sets up an interval to periodically check and update the status of files
    // It's useful for monitoring files that are still being processed

    // Check if there are any files that haven't completed processing
    if (
      files &&
      files.some(
        (file) => file.processStatus !== "FILE_PROCESS_STATUS_COMPLETED",
      )
    ) {
      // Set up an interval to refetch file data every 5 seconds
      // This ensures that the UI stays up-to-date with the latest file processing status
      interval = setInterval(() => {
        refetch();
      }, 5000);
    }

    // Cleanup function to clear the interval and any lingering timeouts when the component unmounts
    // or when the dependencies (files or refetch) change
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

  const handleDelete = (fileUid: string) => {
    const file = files?.find((item) => item.fileUid === fileUid);
    if (file) {
      setFileToDelete(file);
      setShowDeleteMessage(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Timeout mechanism for "soft delete" functionality
      // This delay allows users to undo their delete action within a specified time frame
      // It enhances user experience by providing a safeguard against accidental deletions
      // The actual deletion occurs after the timeout unless the user cancels it
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
      <div className="flex items-center justify-between mb-5">
        <p className="text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <div className="flex flex-col w-full gap-2">
        <div className="flex">
          <div className="flex flex-col w-full">
            {isLoading ? (
              <div className="p-8">
                <Skeleton className="w-full h-8 mb-4" />
                <Skeleton className="w-full h-8 mb-4" />
                <Skeleton className="w-full h-8" />
              </div>
            ) : files && files.length > 0 ? (
              <FileTable
                files={files}
                sortConfig={sortConfig}
                requestSort={requestSort}
                handleDelete={handleDelete}
                handleFileClick={handleFileClick}
                fileToDelete={fileToDelete}
              />
            ) : (
              <EmptyState onGoToUpload={onGoToUpload} />
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
          kbId={knowledgeBase.catalogId}
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
