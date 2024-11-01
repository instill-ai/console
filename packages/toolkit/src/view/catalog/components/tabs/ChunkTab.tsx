"use client";

import * as React from "react";
import { Catalog, CatalogFile, Chunk, Nullable } from "instill-sdk";

import { Button, Separator, Skeleton } from "@instill-ai/design-system";

import { EmptyView } from "../../../../components";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useListNamespaceCatalogFiles,
  useShallow,
  useUpdateCatalogChunk,
} from "../../../../lib";
import FileChunks from "../FileChunks";
import FileDetailsOverlay from "../FileDetailsOverlay";

type ChunkTabProps = {
  catalog: Catalog;
  onGoToUpload: () => void;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const ChunkTab = ({ catalog, onGoToUpload }: ChunkTabProps) => {
  const [expandedFiles, setExpandedFiles] = React.useState<string[]>([]);
  const [selectedChunk, setSelectedChunk] =
    React.useState<Nullable<Chunk>>(null);
  const [selectedFile, setSelectedFile] =
    React.useState<Nullable<CatalogFile>>(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const namespaceCatalogFiles = useListNamespaceCatalogFiles({
    namespaceId: selectedNamespace,
    catalogId: catalog.catalogId,
    accessToken,
    enabled: enabledQuery && Boolean(me.data?.id),
  });

  const files = React.useMemo(() => {
    if (!namespaceCatalogFiles.isSuccess) {
      return [];
    }
    return (namespaceCatalogFiles.data || []).filter(
      (file) => file.processStatus !== "FILE_PROCESS_STATUS_FAILED",
    );
  }, [namespaceCatalogFiles.isSuccess, namespaceCatalogFiles.data]);

  const updateCatalogChunk = useUpdateCatalogChunk();

  const toggleFileExpansion = (fileUid: string) => {
    setExpandedFiles((prev) =>
      prev.includes(fileUid)
        ? prev.filter((id) => id !== fileUid)
        : [...prev, fileUid],
    );
  };

  const handleChunkClick = (file: CatalogFile, chunk: Chunk) => {
    setSelectedFile(file);
    setSelectedChunk(chunk);
    setIsFileDetailsOpen(true);
  };

  const closeOverlay = () => {
    setSelectedFile(null);
    setSelectedChunk(null);
    setIsFileDetailsOpen(false);
  };

  const handleRetrievableToggle = async (
    chunkUid: string,
    currentValue: boolean,
  ) => {
    try {
      await updateCatalogChunk.mutateAsync({
        namespaceId: catalog.namespaceId,
        catalogId: catalog.catalogId,
        fileUid: null,
        chunkUid,
        accessToken,
        retrievable: !currentValue,
      });
    } catch (error) {
      console.error("Failed to update chunk retrievable status:", error);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (
      files.some(
        (file) => file.processStatus !== "FILE_PROCESS_STATUS_COMPLETED",
      )
    ) {
      interval = setInterval(() => {
        namespaceCatalogFiles.refetch();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [files, namespaceCatalogFiles.refetch]);

  return (
    <div className="flex-col">
      <div className="flex items-center justify-between mb-5">
        <p className="text-semantic-fg-primary product-headings-heading-3">
          {catalog.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {namespaceCatalogFiles.isLoading ? (
        <div className="grid gap-16 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex h-[175px] w-[360px] flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-6 rounded bg-semantic-bg-line" />
                <Skeleton className="w-6 h-6 rounded bg-semantic-bg-line" />
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <div className="flex-1">
                <Skeleton className="w-full h-4 mb-2 rounded bg-semantic-bg-line" />
                <Skeleton className="w-2/3 h-4 rounded bg-semantic-bg-line" />
              </div>
              <div className="flex items-end justify-end">
                <Skeleton className="w-8 h-8 rounded bg-semantic-bg-line" />
              </div>
            </div>
          ))}
        </div>
      ) : files.length > 0 ? (
        <div className="flex">
          <div className="w-full pr-4">
            {files.map((file: CatalogFile) => (
              <FileChunks
                key={file.fileUid}
                file={file}
                catalog={catalog}
                accessToken={accessToken}
                expanded={expandedFiles.includes(file.fileUid)}
                onToggleExpand={toggleFileExpansion}
                onChunkClick={handleChunkClick}
                onRetrievableToggle={handleRetrievableToggle}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <EmptyView
            iconName="AlertCircle"
            title="No Chunks Created"
            description="There are no chunks created yet."
            className="flex-1"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              onGoToUpload();
            }}
          >
            Go to Upload Documents
          </Button>
        </div>
      )}
      {selectedFile && selectedChunk && (
        <FileDetailsOverlay
          fileUid={selectedFile.fileUid}
          catalogId={catalog.catalogId}
          accessToken={accessToken}
          onClose={closeOverlay}
          showFullFile={true}
          selectedChunkUid={selectedChunk.chunkUid}
          namespaceId={catalog.ownerName}
          isOpen={isFileDetailsOpen}
          setIsOpen={setIsFileDetailsOpen}
          fileName={selectedFile.name}
          highlightChunk={true}
          fileType={selectedFile.type}
        />
      )}
    </div>
  );
};
