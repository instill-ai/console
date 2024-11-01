"use client";

import * as React from "react";
import { Catalog, CatalogFile, Chunk } from "instill-sdk";

import { cn, Icons, Nullable } from "@instill-ai/design-system";

import { useGetNamespaceCatalogSingleSourceOfTruthFile } from "../../..";
import { useListNamespaceCatalogChunks } from "../../../lib";
import ChunkCard from "./ChunkCard";

type FileChunksProps = {
  file: CatalogFile;
  catalog: Catalog;
  accessToken: Nullable<string>;
  expanded: boolean;
  onToggleExpand: (fileUid: string) => void;
  onChunkClick: (file: CatalogFile, chunk: Chunk) => void;
  onRetrievableToggle: (
    chunkUid: string,
    currentValue: boolean,
  ) => Promise<void>;
};

const FileChunks = ({
  file,
  catalog,
  accessToken,
  expanded,
  onToggleExpand,
  onChunkClick,
  onRetrievableToggle,
}: FileChunksProps) => {
  const namespaceCatalogChunks = useListNamespaceCatalogChunks({
    catalogId: catalog.catalogId,
    accessToken: accessToken || null,
    enabled: expanded,
    namespaceId: catalog.ownerName,
    fileUid: file.fileUid,
    chunkUids: null,
  });

  const catalogSingleSourceOfTruthFile =
    useGetNamespaceCatalogSingleSourceOfTruthFile({
      fileUid: file.fileUid,
      catalogId: catalog.catalogId,
      accessToken: accessToken || null,
      enabled: expanded,
      namespaceId: catalog.ownerName,
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
        namespaceCatalogChunks.refetch();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isProcessing, namespaceCatalogChunks.refetch]);

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
      {expanded &&
        !isProcessing &&
        namespaceCatalogChunks.isSuccess &&
        namespaceCatalogChunks.data.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,360px)] justify-start gap-[15px]">
            {namespaceCatalogChunks.data.map((chunk: Chunk, i: number) => (
              <ChunkCard
                key={chunk.chunkUid}
                chunk={chunk}
                index={i}
                onChunkClick={() => onChunkClick(file, chunk)}
                onRetrievableToggle={onRetrievableToggle}
                fileContent={
                  catalogSingleSourceOfTruthFile.isSuccess
                    ? catalogSingleSourceOfTruthFile.data.content
                    : ""
                }
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default FileChunks;
