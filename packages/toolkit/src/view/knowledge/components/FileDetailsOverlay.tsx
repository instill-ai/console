import React from "react";
import Markdown from "markdown-to-jsx";
import sanitizeHtml from "sanitize-html";
import { Dialog, ScrollArea, Skeleton } from "@instill-ai/design-system";
import {
  useGetFileContent,
  useListChunks,
} from "../../../lib/react-query-service/knowledge";
import { getFileIcon } from "./lib/functions";

type FileDetailsOverlayProps = {
  fileUid: string;
  accessToken: string | null;
  onClose: () => void;
  catalogId: string;
  showFullFile: boolean;
  selectedChunkUid?: string;
  ownerId: string;
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
  ownerId,
  isOpen,
  setIsOpen,
  fileName,
  highlightChunk = false,
  fileType,
}: FileDetailsOverlayProps) => {
  const { data: fileContent, isLoading: isLoadingContent } = useGetFileContent({
    fileUid,
    catalogId,
    accessToken,
    enabled: isOpen,
    ownerId,
  });

  const { data: chunks } = useListChunks({
    catalogId,
    accessToken,
    enabled: isOpen && highlightChunk,
    ownerId,
    fileUid,
  });

  const highlightChunkInContent = React.useCallback(
    (content: string, chunkUid?: string) => {
      if (!highlightChunk || !chunkUid || !content) return content;
      const chunk = chunks?.find(
        (c: { chunkUid: string }) => c.chunkUid === chunkUid
      );
      if (!chunk) return content;
      const { startPos, endPos } = chunk;
      console.log("startPos", startPos, endPos);

      const beforeHighlight = content.slice(0, startPos);
      const highlightedPart = content.slice(startPos, endPos);
      const afterHighlight = content.slice(endPos);

      return `${beforeHighlight}<span class="bg-semantic-bg-line hover:bg-[#CBD2E1]">${highlightedPart}</span>${afterHighlight}`;
    },
    [chunks, highlightChunk]
  );

  const displayContent = React.useMemo(
    () =>
      fileContent ? highlightChunkInContent(fileContent, selectedChunkUid) : "",
    [fileContent, highlightChunkInContent, selectedChunkUid]
  );

  const fileIcon = React.useMemo(() => getFileIcon(fileType), [fileType]);

  const sanitizedHtmlText = React.useMemo(() =>
    sanitizeHtml(displayContent ?? "", {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['span']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        span: ['class']
      }
    }),
    [displayContent]
  );

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
          {isLoadingContent ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <Markdown
              options={{
                overrides: {
                  span: {
                    props: {
                      className: "bg-semantic-bg-line hover:bg-[#CBD2E1]",
                    },
                  },
                },
              }}
            >
              {sanitizedHtmlText}
            </Markdown>
          )}
        </ScrollArea.Root>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FileDetailsOverlay;