"use client";

import * as React from "react";

import { cn, Icons, Nullable } from "@instill-ai/design-system";

import {
  useGetFileContent,
  useListChunks,
} from "../../../lib/react-query-service/knowledge";
import {
  Chunk,
  KnowledgeBase,
  KnowledgeFile,
} from "../../../lib/react-query-service/knowledge/types";
import ChunkCard from "./ChunkCard";

type FileChunksProps = {
  file: KnowledgeFile;
  knowledgeBase: KnowledgeBase;
  accessToken: Nullable<string>;
  expanded: boolean;
  onToggleExpand: (fileUid: string) => void;
  onChunkClick: (file: KnowledgeFile, chunk: Chunk) => void;
  onRetrievableToggle: (
    chunkUid: string,
    currentValue: boolean,
  ) => Promise<void>;
};

const FileChunks = ({
  file,
  knowledgeBase,
  accessToken,
  expanded,
  onToggleExpand,
  onChunkClick,
  onRetrievableToggle,
}: FileChunksProps) => {
  const { data: chunks, refetch } = useListChunks({
    catalogId: knowledgeBase.catalogId,
    accessToken: accessToken || null,
    enabled: expanded,
    ownerId: knowledgeBase.ownerName,
    fileUid: file.fileUid,
  });

  const { data: fileContent } = useGetFileContent({
    fileUid: file.fileUid,
    catalogId: knowledgeBase.catalogId,
    accessToken: accessToken || null,
    enabled: expanded,
    ownerId: knowledgeBase.ownerName,
  });

  const isProcessing = file.processStatus !== "FILE_PROCESS_STATUS_COMPLETED";

  const handleToggleExpand = () => {
    if (!isProcessing) {
      onToggleExpand(file.fileUid);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Set up an interval to refetch chunks if the file is still processing
    if (isProcessing) {
      interval = setInterval(() => {
        refetch();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isProcessing, refetch]);

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
          {file.name}
        </p>
        {isProcessing && (
          <p className="text-semantic-fg-secondary italic">
            Processing file...
          </p>
        )}
      </div>
      {expanded && !isProcessing && chunks && chunks.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,360px)] justify-start gap-[15px]">
          {chunks.map((chunk: Chunk, i: number) => (
            <ChunkCard
              key={chunk.chunkUid}
              chunk={chunk}
              index={i}
              onChunkClick={() => onChunkClick(file, chunk)}
              onRetrievableToggle={onRetrievableToggle}
              fileContent={fileContent || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileChunks;
