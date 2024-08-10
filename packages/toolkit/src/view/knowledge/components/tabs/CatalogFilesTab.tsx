import * as React from "react";
import { Separator, Skeleton } from "@instill-ai/design-system";
import {
  InstillStore,
  useAuthenticatedUser,
  useAuthenticatedUserSubscription,
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
import FileDetailsOverlay from "../FileDetailsOverlay";
import { FileTable } from "../FileTable";
import { getPlanStorageLimit } from "../lib/helpers";
import { InsufficientStorageBanner, UpgradePlanLink } from "../notifications";
import { EmptyState } from "../EmptyState";

type CatalogFilesTabProps = {
  knowledgeBase: KnowledgeBase;
  onGoToUpload: () => void;
  remainingStorageSpace: number;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const CatalogFilesTab = ({
  knowledgeBase,
  onGoToUpload,
  remainingStorageSpace,
}: CatalogFilesTabProps) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof File | "";
    direction: "ascending" | "descending" | "";
  }>({
    key: "",
    direction: "",
  });

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector)
  );

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const {
    data: filesData,
    isLoading,
    refetch: refetchFiles,
  } = useListKnowledgeBaseFiles({
    namespaceId: selectedNamespace,
    knowledgeBaseId: knowledgeBase.catalogId,
    accessToken,
    enabled: enabledQuery && Boolean(me.data?.id),
    pageSize: 100,
  });

  const [files, setFiles] = React.useState<File[]>([]);
  React.useEffect(() => {
    setFiles(filesData?.files || []);
  }, [filesData]);

  React.useEffect(() => {
    // Refetch files when the component mounts or when the knowledgeBase changes
    refetchFiles();
  }, [knowledgeBase, refetchFiles]);

  const deleteKnowledgeBaseFile = useDeleteKnowledgeBaseFile();
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const sub = useAuthenticatedUserSubscription({
    enabled: enabledQuery,
    accessToken,
  });

  const planStorageLimit = getPlanStorageLimit(sub.data?.plan || "PLAN_FREE");

  const [showStorageWarning, setShowStorageWarning] = React.useState((remainingStorageSpace / planStorageLimit) * 100 <= 5);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (
      files &&
      files.some(
        (file) => file.processStatus !== "FILE_PROCESS_STATUS_COMPLETED"
      )
    ) {
      interval = setInterval(() => {
        refetchFiles();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [files, refetchFiles]);

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    setIsFileDetailsOpen(true);
  };

  const closeOverlay = () => {
    setSelectedFile(null);
    setIsFileDetailsOpen(false);
  };

  const handleDelete = async (fileUid: string) => {
    try {
      await deleteKnowledgeBaseFile.mutateAsync({
        fileUid,
        accessToken,
      });
      await refetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const requestSort = (key: keyof File) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  React.useEffect(() => {
    setShowStorageWarning((remainingStorageSpace / planStorageLimit) * 100 <= 5);
  }, [remainingStorageSpace, planStorageLimit]);

  return (
    <div className="flex flex-col">
      {showStorageWarning && (
        <InsufficientStorageBanner
          setshowStorageWarning={setShowStorageWarning}
        />
      )}
      <div className="flex flex-col items-start justify-start gap-1 mb-2">
        <p className="text-semantic-fg-primary product-headings-heading-3">
          {knowledgeBase.name}
        </p>
        <p className="flex flex-col gap-1">
          <span className="text-semantic-fg-secondary product-body-text-3-regular">Remaining storage space: {(remainingStorageSpace / (1024 * 1024)).toFixed(2)} MB</span>
          <UpgradePlanLink pageName="catalog" accessToken={accessToken} enabledQuery={enabledQuery} />
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
              />
            ) : (
              <EmptyState onGoToUpload={onGoToUpload} />
            )}
          </div>
        </div>
      </div>
      {selectedFile && (
        <FileDetailsOverlay
          fileUid={selectedFile.fileUid}
          catalogId={knowledgeBase.catalogId}
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