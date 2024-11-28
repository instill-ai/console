"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";
import sanitizeHtml from "sanitize-html";

import { Dialog, ScrollArea, Skeleton } from "@instill-ai/design-system";

import {
  useGetNamespaceCatalogSingleSourceOfTruthFile,
  useListNamespaceCatalogChunks,
} from "../../../lib";
import { MarkdownViewer } from "../../../lib/markdown";
import { getFileIcon } from "./lib/helpers";

type FileDetailsOverlayProps = {
  fileUid: string;
  accessToken: Nullable<string>;
  onClose: () => void;
  catalogId: string;
  showFullFile: boolean;
  selectedChunkUid?: string;
  namespaceId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fileName: string;
  highlightChunk?: boolean;
  fileType: string;
};

const FileDetailsOverlay = ({
  fileUid,
  accessToken,
  catalogId,
  selectedChunkUid,
  namespaceId,
  isOpen,
  setIsOpen,
  fileName,
  highlightChunk = false,
  fileType,
}: FileDetailsOverlayProps) => {
  const catalogSingleSourceOfTruthFile =
    useGetNamespaceCatalogSingleSourceOfTruthFile({
      fileUid,
      catalogId,
      accessToken,
      enabled: isOpen,
      namespaceId,
    });

  const namespaceCatalogChunks = useListNamespaceCatalogChunks({
    catalogId,
    accessToken,
    enabled: isOpen && highlightChunk,
    namespaceId,
    fileUid,
    chunkUids: null,
  });

  const highlightChunkInContent = React.useCallback(
    (content: string, chunkUid?: string) => {
      if (!highlightChunk || !chunkUid || !content) return content;
      const chunk = namespaceCatalogChunks.data?.find(
        (c: { chunkUid: string }) => c.chunkUid === chunkUid,
      );
      if (!chunk) return content;
      const { startPos, endPos } = chunk;

      // Handle different file types
      if (fileType.includes("TEXT") || fileType.includes("MARKDOWN")) {
        // For text-based files, use HTML span for highlighting
        const beforeHighlight = content.slice(0, startPos);
        const highlightedPart = content.slice(startPos, endPos + 1);
        const afterHighlight = content.slice(endPos + 1);
        return `${beforeHighlight}<span class="bg-semantic-bg-line hover:bg-[#CBD2E1]">${highlightedPart}</span>${afterHighlight}`;
      } else {
        // For other file types, use a more robust method
        return content
          .split("\n")
          .map((line, index) => {
            const lineStart =
              content.split("\n").slice(0, index).join("\n").length +
              (index > 0 ? 1 : 0);
            const lineEnd = lineStart + line.length;
            if (lineStart <= endPos && lineEnd >= startPos) {
              const highlightStart = Math.max(startPos - lineStart, 0);
              const highlightEnd = Math.min(
                endPos - lineStart + 1,
                line.length,
              );
              return `${line.slice(0, highlightStart)}<span class="bg-semantic-bg-line hover:bg-[#CBD2E1]">${line.slice(highlightStart, highlightEnd)}</span>${line.slice(highlightEnd)}`;
            }
            return line;
          })
          .join("\n");
      }
    },
    [namespaceCatalogChunks.data, highlightChunk, fileType],
  );

  const displayContent = React.useMemo(
    () =>
      catalogSingleSourceOfTruthFile.isSuccess
        ? highlightChunkInContent(
            catalogSingleSourceOfTruthFile.data.content,
            selectedChunkUid,
          )
        : "",
    [
      catalogSingleSourceOfTruthFile.data,
      catalogSingleSourceOfTruthFile.isSuccess,
      highlightChunkInContent,
      selectedChunkUid,
    ],
  );

  const sanitizedHtmlText = React.useMemo(
    () =>
      sanitizeHtml(displayContent ?? "", {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["span"]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          span: ["class"],
        },
      }),
    [displayContent],
  );
  const fileIcon = React.useMemo(() => getFileIcon(fileType), [fileType]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content className="flex flex-col h-[90vh] max-w-[40vw]">
        <div className="flex-shrink-0 mb-3 flex flex-row space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line shadow-xs overflow-hidden">
            {fileIcon}
          </div>
          <div className="flex flex-col min-w-0">
            <Dialog.Title className="truncate product-headings-heading-6 text-semantic-fg-disabled">
              {fileName}
            </Dialog.Title>
            <div className="truncate product-headings-heading-5 text-semantic-fg-primary">
              {fileType.replace("FILE_TYPE_", "")}
            </div>
          </div>
        </div>
        <ScrollArea.Root className="flex-grow overflow-hidden">
          {catalogSingleSourceOfTruthFile.isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <MarkdownViewer markdown={sanitizedHtmlText} />
          )}
        </ScrollArea.Root>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FileDetailsOverlay;
