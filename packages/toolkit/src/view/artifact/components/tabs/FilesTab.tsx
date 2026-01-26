"use client";

import * as React from "react";
import {
  KnowledgeBase,
  File as KnowledgeBaseFile,
  Nullable,
} from "instill-sdk";

import { Separator, Skeleton } from "@instill-ai/design-system";

import type {
  OrganizationSubscription,
  UserSubscription,
} from "../lib/helpers";
import {
  InstillStore,
  toastInstillError,
  useAuthenticatedUser,
  useDeleteNamespaceFile,
  useInstillStore,
  useListNamespaceFiles,
  useShallow,
} from "../../../../lib";
import { EmptyState } from "../EmptyState";
import FileDetailsOverlay from "../FileDetailsOverlay";
import { FileTable } from "../FileTable";
//import { getPlanStorageLimit, shouldShowStorageWarning } from "../lib/helpers";
import {
  FileIsBeingDeletedNotification,
  //InsufficientStorageBanner,
  //UpgradePlanLink,
} from "../notifications";

type FilesTabProps = {
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

export const FilesTab = ({
  knowledgeBase,
  onGoToUpload,
  //remainingStorageSpace,
  //subscription,
  updateRemainingSpace,
  //namespaceType,
  //isLocalEnvironment,
}: FilesTabProps) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof KnowledgeBaseFile | "";
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

  const filesData = useListNamespaceFiles({
    namespaceId: selectedNamespace,
    knowledgeBaseId: knowledgeBase.id,
    accessToken,
    enabled: enabledQuery && Boolean(me.data?.id),
    refetchInterval: (query) => {
      // Only refetch if there are files being processed or waiting to be processed
      if (query.state.data && Array.isArray(query.state.data)) {
        const hasProcessingFiles = query.state.data.some(
          (file: KnowledgeBaseFile) =>
            file.processStatus === "FILE_PROCESS_STATUS_NOTSTARTED" ||
            file.processStatus === "FILE_PROCESS_STATUS_PROCESSING" ||
            file.processStatus === "FILE_PROCESS_STATUS_CHUNKING" ||
            file.processStatus === "FILE_PROCESS_STATUS_EMBEDDING",
        );
        return hasProcessingFiles ? 5000 : false;
      }
      return 0;
    },
  });

  const [files, setFiles] = React.useState<KnowledgeBaseFile[]>([]);
  const [deletingFile, setDeletingFile] =
    React.useState<Nullable<string>>(null);

  React.useEffect(() => {
    if (filesData.isSuccess && filesData.data) {
      setFiles(filesData.data);
    }
  }, [filesData.isSuccess, filesData.data]);

  const deleteFile = useDeleteNamespaceFile();
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] =
    React.useState<Nullable<KnowledgeBaseFile>>(null);

  //const plan = subscription?.plan || "PLAN_FREE";
  //const planStorageLimit = getPlanStorageLimit(plan);
  //const isEnterprisePlan = subscription?.plan === "PLAN_ENTERPRISE";

  //const [showStorageWarning, setShowStorageWarning] = React.useState(shouldShowStorageWarning(remainingStorageSpace, planStorageLimit));

  const handleFileClick = (file: KnowledgeBaseFile) => {
    setSelectedFile(file);
    setIsFileDetailsOpen(true);
  };

  const closeOverlay = () => {
    setSelectedFile(null);
    setIsFileDetailsOpen(false);
  };

  const handleDelete = async (fileId: string) => {
    try {
      const fileToDelete = files.find((file) => file.id === fileId);
      if (fileToDelete) {
        setDeletingFile(fileToDelete.displayName);

        await deleteFile.mutateAsync({
          fileId,
          accessToken,
          namespaceId: selectedNamespace ?? "",
          knowledgeBaseId: knowledgeBase.id,
        });

        updateRemainingSpace(fileToDelete.size, false);
        await filesData.refetch();

        setDeletingFile(null);
      }
    } catch (error) {
      toastInstillError({
        title: "Failed to delete file",
        error,
      });
      setDeletingFile(null);
    }
  };

  const requestSort = (key: keyof KnowledgeBaseFile) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // React.useEffect(() => {
  //   setShowStorageWarning(
  //     shouldShowStorageWarning(remainingStorageSpace, planStorageLimit),
  //   );
  // }, [remainingStorageSpace, planStorageLimit]);

  return (
    <React.Fragment>
      <div className="flex flex-col mb-10">
        {/* {!isLocalEnvironment && showStorageWarning && !isEnterprisePlan ? (
          <InsufficientStorageBanner
            setshowStorageWarning={setShowStorageWarning}
            plan={subscription?.plan || "PLAN_FREE"}
            namespaceType={namespaceType}
            selectedNamespace={selectedNamespace}
          />
        ) : null} */}
        <div className="flex flex-col items-start justify-start gap-1 mb-2">
          <p className="text-semantic-fg-primary product-headings-heading-3">
            {knowledgeBase.id}
          </p>
          {/* <p className="flex flex-col gap-1">
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
                selectedNamespace={selectedNamespace}
              />
            ) : null}
          </p> */}
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
        {selectedFile ? (
          <FileDetailsOverlay
            fileId={selectedFile.id}
            knowledgeBaseId={knowledgeBase.id}
            accessToken={accessToken}
            onClose={closeOverlay}
            showFullFile={true}
            namespaceId={selectedNamespace ?? ""}
            isOpen={isFileDetailsOpen}
            setIsOpen={setIsFileDetailsOpen}
            fileName={selectedFile.displayName}
            fileType={selectedFile.type}
          />
        ) : null}
      </div>

      {deletingFile ? (
        <FileIsBeingDeletedNotification
          fileName={deletingFile}
          handleCloseDeleteMessage={() => setDeletingFile(null)}
        />
      ) : null}
    </React.Fragment>
  );
};
