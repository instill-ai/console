"use client";

import * as React from "react";
import {
  Nullable,
  OrganizationSubscription,
  UserSubscription,
} from "instill-sdk";

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
import { EmptyState } from "../EmptyState";
import FileDetailsOverlay from "../FileDetailsOverlay";
import { FileTable } from "../FileTable";
import { getPlanStorageLimit, shouldShowStorageWarning } from "../lib/helpers";
import { InsufficientStorageBanner, UpgradePlanLink } from "../notifications";

type CatalogFilesTabProps = {
  knowledgeBase: KnowledgeBase;
  onGoToUpload: () => void;
  remainingStorageSpace: number;
  subscription: Nullable<UserSubscription | OrganizationSubscription>;
  updateRemainingSpace: (fileSize: number, isAdding: boolean) => void;
  namespaceType: Nullable<"user" | "organization">;
  isLocalEnvironment: boolean;
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
  subscription,
  updateRemainingSpace,
  namespaceType,
  isLocalEnvironment,
}: CatalogFilesTabProps) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof File | "";
    direction: "ascending" | "descending" | "";
  }>({
    key: "",
    direction: "",
  });

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const filesData = useListKnowledgeBaseFiles({
    namespaceId: selectedNamespace,
    knowledgeBaseId: knowledgeBase.catalogId,
    accessToken,
    enabled: enabledQuery && Boolean(me.data?.id),
  });

  const [files, setFiles] = React.useState<File[]>([]);
  React.useEffect(() => {
    if (filesData.isSuccess && filesData.data) {
      setFiles(filesData.data);
    }
  }, [filesData.isSuccess, filesData.data]);

  React.useEffect(() => {
    filesData.refetch();
  }, [knowledgeBase, filesData.refetch]);

  const deleteKnowledgeBaseFile = useDeleteKnowledgeBaseFile();
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<Nullable<File>>(null);

  const plan = subscription?.plan || "PLAN_FREE";
  const planStorageLimit = getPlanStorageLimit(plan);
  const isEnterprisePlan = subscription?.plan === "PLAN_ENTERPRISE";

  const [showStorageWarning, setShowStorageWarning] = React.useState(
    shouldShowStorageWarning(remainingStorageSpace, planStorageLimit),
  );

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (
      files &&
      files.some(
        (file) => file.processStatus !== "FILE_PROCESS_STATUS_COMPLETED",
      )
    ) {
      interval = setInterval(() => {
        filesData.refetch();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [files, filesData]);

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
      const fileToDelete = files.find((file) => file.fileUid === fileUid);
      if (fileToDelete) {
        await deleteKnowledgeBaseFile.mutateAsync({
          fileUid,
          accessToken,
        });
        updateRemainingSpace(fileToDelete.size, false);
      }
      await filesData.refetch();
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
    setShowStorageWarning(
      shouldShowStorageWarning(remainingStorageSpace, planStorageLimit),
    );
  }, [remainingStorageSpace, planStorageLimit]);

  return (
    <div className="flex flex-col mb-10">
      {!isLocalEnvironment && showStorageWarning && !isEnterprisePlan ? (
        <InsufficientStorageBanner
          setshowStorageWarning={setShowStorageWarning}
        />
      ) : null}
      <div className="flex flex-col items-start justify-start gap-1 mb-2">
        <p className="text-semantic-fg-primary product-headings-heading-3">
          {knowledgeBase.name}
        </p>
        <p className="flex flex-col gap-1">
          {!isLocalEnvironment && !isEnterprisePlan ? (
            <span className="text-semantic-fg-secondary product-body-text-3-regular">
              Remaining storage space:{" "}
              {(remainingStorageSpace / (1024 * 1024)).toFixed(2)} MB
            </span>
          ) : null}
          {!isLocalEnvironment && !isEnterprisePlan ? (
            <UpgradePlanLink
              plan={subscription?.plan || "PLAN_FREE"}
              namespaceType={namespaceType}
              pageName="catalog"
            />
          ) : null}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <div className="flex flex-col w-full gap-2">
        <div className="flex">
          <div className="flex flex-col w-full">
            {filesData.isLoading ? (
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
