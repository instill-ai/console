import React from "react";
import { Nullable } from "@instill-ai/toolkit";

import { Button, Icons, Separator, Skeleton } from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import {
  useListKnowledgeBaseFiles,
  useUpdateChunk,
} from "../../../../lib/react-query-service/knowledge";
import FileChunks from "../FileChunks";
import FileDetailsOverlay from "../FileDetailsOverlay";
import { Chunk, KnowledgeBase, KnowledgeFile } from "../../../../lib/react-query-service/knowledge/types";

type ChunkTabProps = {
  knowledgeBase: KnowledgeBase;
  onGoToUpload: () => void;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const ChunkTab: React.FC<ChunkTabProps> = ({
  knowledgeBase,
  onGoToUpload,
}) => {
  const [expandedFiles, setExpandedFiles] = React.useState<string[]>([]);
  const [selectedChunk, setSelectedChunk] =
    React.useState<Nullable<Chunk>>(null);
  const [selectedFile, setSelectedFile] =
    React.useState<Nullable<KnowledgeFile>>(null);
  const [isFileDetailsOpen, setIsFileDetailsOpen] = React.useState(false);

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));


  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const { data: files, isLoading: isLoadingFiles } = useListKnowledgeBaseFiles({
    namespaceId: me.data?.id ?? null,
    knowledgeBaseId: knowledgeBase.kbId,
    accessToken,
    enabled: enabledQuery && Boolean(me.data?.id),
  });

  const updateChunkMutation = useUpdateChunk();

  React.useEffect(() => {
    if (files && files.length > 0 && files[0]?.fileUid) {
      setExpandedFiles([files[0].fileUid]);
    }
  }, [files]);

  const toggleFileExpansion = (fileUid: string) => {
    setExpandedFiles((prev) =>
      prev.includes(fileUid)
        ? prev.filter((id) => id !== fileUid)
        : [...prev, fileUid],
    );
  };

  const handleChunkClick = (file: KnowledgeFile, chunk: Chunk) => {
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
      await updateChunkMutation.mutateAsync({
        chunkUid,
        accessToken,
        retrievable: !currentValue,
      });
    } catch (error) {
      console.error("Failed to update chunk retrievable status:", error);
    }
  };

  return (
    <div className="flex-col">
      <div className="flex items-center justify-between mb-5">
        <p className="text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {isLoadingFiles ? (
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
      ) : files && files.length > 0 ? (
        <div className="flex">
          <div className="w-full pr-4">
            {files.map((file: KnowledgeFile) => (
              <FileChunks
                key={file.fileUid}
                file={file}
                knowledgeBase={knowledgeBase}
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
        <div className="flex flex-col items-center justify-center p-8 text-center mt-40">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line shadow-xs mb-8">
            <Icons.AlertCircle className="w-6 h-6 stroke-semantic-fg-primary" />
          </div>
          <p className="mb-2 product-headings-heading-2">No Chunks Created</p>
          <p className="mb-4 text-semantic-fg-secondary product-body-text-2-regular">
            There are no chunks created yet.
          </p>
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
          kbId={knowledgeBase.kbId}
          accessToken={accessToken}
          onClose={closeOverlay}
          showFullFile={true}
          selectedChunkUid={selectedChunk.chunkUid}
          ownerId={knowledgeBase.ownerName}
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
