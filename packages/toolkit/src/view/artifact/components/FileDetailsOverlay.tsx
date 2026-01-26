"use client";

import * as React from "react";
import { Chunk, Nullable } from "instill-sdk";
import sanitizeHtml from "sanitize-html";

import { Dialog, Skeleton } from "@instill-ai/design-system";

import { useGetNamespaceFile, useListNamespaceChunks } from "../../../lib";
import { MarkdownViewer } from "../../../lib/markdown";
import { getFileIcon } from "./lib/helpers";

type FileDetailsOverlayProps = {
  fileId: string;
  accessToken: Nullable<string>;
  onClose: () => void;
  knowledgeBaseId: string;
  showFullFile: boolean;
  selectedChunkId?: string;
  namespaceId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fileName: string;
  highlightChunk?: boolean;
  fileType: string;
};

const FileDetailsOverlay = ({
  fileId,
  accessToken,
  knowledgeBaseId,
  selectedChunkId,
  namespaceId,
  isOpen,
  setIsOpen,
  fileName,
  showFullFile,
  highlightChunk = false,
  fileType,
}: FileDetailsOverlayProps) => {
  const fileData = useGetNamespaceFile({
    fileId,
    knowledgeBaseId,
    accessToken,
    enabled: isOpen,
    namespaceId,
  });

  const chunks = useListNamespaceChunks({
    knowledgeBaseId,
    accessToken,
    enabled: isOpen && (highlightChunk || !showFullFile),
    namespaceId,
    fileId,
    chunkIds: null,
  });

  const extractChunkContent = React.useCallback(
    (content: string, summaryContent: string, chunkId?: string) => {
      if (!chunkId) {
        return content;
      }

      // Wait for chunks to load if we need them
      if (!showFullFile && !chunks.isSuccess) {
        return "";
      }

      const chunk = chunks.data?.find((c: Chunk) => c.id === chunkId);

      if (!chunk) {
        return content;
      }

      // Use appropriate source content based on chunk type
      const chunkWithType = chunk as typeof chunk & { type?: string };
      const sourceContent =
        chunkWithType.type === "TYPE_SUMMARY" ? summaryContent : content;

      if (!sourceContent) {
        return content;
      }

      if (
        chunk.markdownReference?.start?.coordinates?.[0] === undefined ||
        chunk.markdownReference?.end?.coordinates?.[0] === undefined
      ) {
        return sourceContent;
      }

      const startPos = chunk.markdownReference.start.coordinates[0];
      const endPos = chunk.markdownReference.end.coordinates[0];

      // If showFullFile is false, return only the chunk content
      if (!showFullFile) {
        return sourceContent.slice(startPos, endPos);
      }

      // Otherwise, return full content with highlighting
      if (!highlightChunk) {
        return sourceContent;
      }

      // Handle different file types for highlighting
      if (fileType.includes("TEXT") || fileType.includes("MARKDOWN")) {
        // For text-based files, use HTML span for highlighting
        const beforeHighlight = sourceContent.slice(0, startPos);
        const highlightedPart = sourceContent.slice(startPos, endPos);
        const afterHighlight = sourceContent.slice(endPos);
        return `${beforeHighlight}<span class="bg-semantic-bg-line hover:bg-[#CBD2E1]">${highlightedPart}</span>${afterHighlight}`;
      } else {
        // For other file types, use a more robust method
        return sourceContent
          .split("\n")
          .map((line, index) => {
            const lineStart =
              sourceContent.split("\n").slice(0, index).join("\n").length +
              (index > 0 ? 1 : 0);
            const lineEnd = lineStart + line.length;
            if (lineStart <= endPos && lineEnd >= startPos) {
              const highlightStart = Math.max(startPos - lineStart, 0);
              const highlightEnd = Math.min(endPos - lineStart, line.length);
              return `${line.slice(0, highlightStart)}<span class="bg-semantic-bg-line hover:bg-[#CBD2E1]">${line.slice(highlightStart, highlightEnd)}</span>${line.slice(highlightEnd)}`;
            }
            return line;
          })
          .join("\n");
      }
    },
    [chunks.data, chunks.isSuccess, highlightChunk, fileType, showFullFile],
  );

  const displayContent = React.useMemo(
    () =>
      fileData.isSuccess
        ? extractChunkContent(
            fileData.data.content,
            fileData.data.summaryContent,
            selectedChunkId,
          )
        : "",
    [fileData.data, fileData.isSuccess, extractChunkContent, selectedChunkId],
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
      <Dialog.Content className="flex flex-col h-[90vh] max-w-[70vw] w-[70vw]">
        <div className="flex-shrink-0 mb-3 flex flex-row space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[10px] border border-semantic-bg-line shadow-xs overflow-hidden bg-semantic-bg-secondary">
            <div className="text-semantic-fg-primary [&_svg]:!h-10 [&_svg]:!w-10">
              {fileIcon}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <Dialog.Title className="truncate product-headings-heading-6 text-semantic-fg-disabled">
              {fileName}
            </Dialog.Title>
            <Dialog.Description className="truncate product-headings-heading-5 text-semantic-fg-primary">
              {fileType.replace("TYPE_", "")}
            </Dialog.Description>
          </div>
        </div>
        <div className="flex-grow overflow-auto border border-semantic-bg-line rounded p-4">
          {fileData.isLoading || (!showFullFile && chunks.isLoading) ? (
            <div className="space-y-2">
              <Skeleton key="skeleton-1" className="h-4 w-full" />
              <Skeleton key="skeleton-2" className="h-4 w-full" />
              <Skeleton key="skeleton-3" className="h-4 w-3/4" />
            </div>
          ) : (
            <MarkdownViewer markdown={sanitizedHtmlText} />
          )}
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FileDetailsOverlay;
