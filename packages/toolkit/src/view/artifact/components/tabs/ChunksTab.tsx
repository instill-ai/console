"use client";

import * as React from "react";
import {
  Chunk,
  KnowledgeBase,
  File as KnowledgeBaseFile,
  Nullable,
} from "instill-sdk";

import { Button, Separator, Skeleton } from "@instill-ai/design-system";

import { EmptyView } from "../../../../components";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useListNamespaceFiles,
  useShallow,
  useUpdateNamespaceChunk,
} from "../../../../lib";
import FileChunks from "../FileChunks";
import FileDetailsOverlay from "../FileDetailsOverlay";

type ChunksTabProps = {
  knowledgeBase: KnowledgeBase;
  onGoToUpload: () => void;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const ChunksTab = ({ knowledgeBase, onGoToUpload }: ChunksTabProps) => {
  const [expandedFiles, setExpandedFiles] = React.useState<string[]>([]);
  const [selectedChunk, setSelectedChunk] =
    React.useState<Nullable<Chunk>>(null);
  const [selectedFile, setSelectedFile] =
    React.useState<Nullable<KnowledgeBaseFile>>(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const files = useListNamespaceFiles({
    namespaceId: selectedNamespace,
    knowledgeBaseId: knowledgeBase.id,
    accessToken,
    enabled: enabledQuery && Boolean(me.data?.id),
  });

  const filteredFiles = React.useMemo(() => {
    if (!files.isSuccess) {
      return [];
    }
    return (files.data || []).filter(
      (file) => file.processStatus !== "FILE_PROCESS_STATUS_FAILED",
    );
  }, [files.isSuccess, files.data]);

  const updateChunk = useUpdateNamespaceChunk();

  const toggleFileExpansion = (fileUid: string) => {
    setExpandedFiles((prev) =>
      prev.includes(fileUid)
        ? prev.filter((id) => id !== fileUid)
        : [...prev, fileUid],
    );
  };

  const handleChunkClick = (file: KnowledgeBaseFile, chunk: Chunk) => {
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
      await updateChunk.mutateAsync({
        namespaceId: selectedNamespace,
        knowledgeBaseId: knowledgeBase.id,
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
      filteredFiles.some(
        (file) => file.processStatus !== "FILE_PROCESS_STATUS_COMPLETED",
      )
    ) {
      interval = setInterval(() => {
        files.refetch();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [filteredFiles, files]);

  return (
    <div className="flex-col">
      <div className="flex items-center justify-between mb-5">
        <p className="text-semantic-fg-primary product-headings-heading-3">
          {knowledgeBase.id}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {files.isLoading ? (
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
      ) : filteredFiles.length > 0 ? (
        <div className="flex">
          <div className="w-full pr-4">
            {filteredFiles.map((file: KnowledgeBaseFile) => (
              <FileChunks
                key={file.uid}
                file={file}
                knowledgeBase={knowledgeBase}
                accessToken={accessToken}
                namespaceId={selectedNamespace}
                expanded={expandedFiles.includes(file.uid)}
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
          fileUid={selectedFile.uid}
          knowledgeBaseId={knowledgeBase.id}
          accessToken={accessToken}
          onClose={closeOverlay}
          showFullFile={false}
          selectedChunkUid={selectedChunk.uid}
          namespaceId={selectedNamespace ?? ""}
          isOpen={isFileDetailsOpen}
          setIsOpen={setIsFileDetailsOpen}
          fileName={selectedFile.filename}
          highlightChunk={false}
          fileType={selectedFile.type}
        />
      )}
    </div>
  );
};
