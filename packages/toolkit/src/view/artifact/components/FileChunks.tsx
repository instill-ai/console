"use client";

import * as React from "react";
import { Chunk, File, KnowledgeBase } from "instill-sdk";

import { cn, Icons, Nullable } from "@instill-ai/design-system";

import { useGetNamespaceFile } from "../../..";
import { useListNamespaceChunks } from "../../../lib";
import ChunkCard from "./ChunkCard";

type FileChunksProps = {
  file: File;
  knowledgeBase: KnowledgeBase;
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  expanded: boolean;
  onToggleExpand: (fileUid: string) => void;
  onChunkClick: (file: File, chunk: Chunk) => void;
  onRetrievableToggle: (
    chunkUid: string,
    currentValue: boolean,
  ) => Promise<void>;
};

const FileChunks = ({
  file,
  knowledgeBase,
  accessToken,
  namespaceId,
  expanded,
  onToggleExpand,
  onChunkClick,
  onRetrievableToggle,
}: FileChunksProps) => {
  const chunks = useListNamespaceChunks({
    knowledgeBaseId: knowledgeBase.id,
    accessToken: accessToken || null,
    enabled: expanded,
    namespaceId: namespaceId,
    fileUid: file.uid,
    chunkUids: null,
  });

  const fileData = useGetNamespaceFile({
    fileUid: file.uid,
    knowledgeBaseId: knowledgeBase.id,
    accessToken: accessToken || null,
    enabled: expanded,
    namespaceId: namespaceId,
  });

  const isProcessing = file.processStatus !== "FILE_PROCESS_STATUS_COMPLETED";

  const handleToggleExpand = () => {
    if (!isProcessing) {
      onToggleExpand(file.uid);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Set up an interval to refetch chunks if the file is still processing
    if (isProcessing) {
      interval = setInterval(() => {
        chunks.refetch();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isProcessing, chunks]);

  // Sort chunks by type: TYPE_SUMMARY > TYPE_CONTENT > TYPE_AUGMENTED
  const sortedChunks = React.useMemo(() => {
    if (!chunks.isSuccess || !chunks.data) return [];

    const getTypePriority = (chunk: Chunk): number => {
      const chunkWithType = chunk as Chunk & { type?: string };
      switch (chunkWithType.type) {
        case "TYPE_SUMMARY":
          return 1;
        case "TYPE_CONTENT":
          return 2;
        case "TYPE_AUGMENTED":
          return 3;
        default:
          return 4; // TYPE_UNSPECIFIED or unknown types go last
      }
    };

    return [...chunks.data].sort((a, b) => {
      return getTypePriority(a) - getTypePriority(b);
    });
  }, [chunks.isSuccess, chunks.data]);

  return (
    <div className="mb-4">
      <div
        className={cn(
          "mb-4 flex items-center space-x-2",
          isProcessing ? "cursor-not-allowed" : "cursor-pointer",
        )}
        onClick={handleToggleExpand}
      >
        <Icons.ChevronDown
          className={cn(
            "h-4 w-4 stroke-semantic-fg-primary transition-transform",
            expanded && !isProcessing ? "" : "-rotate-90",
            isProcessing ? "opacity-50" : "",
          )}
        />
        <p
          className={cn(
            "font-semibold text-[16px] leading-4 mr-6",
            isProcessing
              ? "text-semantic-fg-disabled"
              : "text-semantic-fg-secondary",
          )}
        >
          {file.filename}
        </p>
        {isProcessing && (
          <p className="text-semantic-fg-secondary italic">
            Processing file...
          </p>
        )}
      </div>
      {expanded &&
        !isProcessing &&
        chunks.isSuccess &&
        sortedChunks.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,360px)] justify-start gap-[15px]">
            {sortedChunks.map((chunk: Chunk, i: number) => {
              // Use summaryContent for TYPE_SUMMARY chunks, content for others
              const chunkWithType = chunk as Chunk & { type?: string };
              const sourceContent = fileData.isSuccess
                ? chunkWithType.type === "TYPE_SUMMARY"
                  ? fileData.data.summaryContent
                  : fileData.data.content
                : "";

              return (
                <ChunkCard
                  key={chunk.uid}
                  chunk={chunk}
                  index={i}
                  onChunkClick={() => onChunkClick(file, chunk)}
                  onRetrievableToggle={onRetrievableToggle}
                  fileContent={sourceContent}
                />
              );
            })}
          </div>
        )}
    </div>
  );
};

export default FileChunks;
