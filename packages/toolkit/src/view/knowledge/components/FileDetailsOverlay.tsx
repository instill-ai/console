import React from 'react';
import { Dialog, Icons, ScrollArea, Skeleton } from "@instill-ai/design-system";
import {
  useGetFileContent,
  useListChunks,
} from "../../../lib/react-query-service/knowledge";

type FileDetailsOverlayProps = {
  fileUid: string;
  accessToken: string | null;
  onClose: () => void;
  kbId: string;
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
  kbId,
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
    kbId,
    accessToken,
    enabled: isOpen,
    ownerId,
  });

  const { data: chunks } = useListChunks({
    kbId,
    accessToken,
    enabled: isOpen && highlightChunk,
    ownerId,
    fileUid,
  });

  const highlightChunkInContent = React.useCallback(
    (content: string, chunkUid?: string) => {
      if (!highlightChunk || !chunkUid || !content) return content;
      const chunk = chunks?.find(
        (c: { chunkUid: string }) => c.chunkUid === chunkUid,
      );
      if (!chunk) return content;
      const { startPos, endPos } = chunk;
      return (
        content.slice(0, startPos) +
        `<span class="bg-semantic-bg-line hover:bg-[#CBD2E1]">${content.slice(startPos, endPos)}</span>` +
        content.slice(endPos)
      );
    },
    [chunks, highlightChunk]
  );

  const displayContent = React.useMemo(() =>
    fileContent ? highlightChunkInContent(fileContent, selectedChunkUid) : "",
    [fileContent, highlightChunkInContent, selectedChunkUid]
  );
  const getFileIcon = React.useCallback(() => {
    switch (fileType.toUpperCase()) {
      case "FILE_TYPE_MARKDOWN":
        return <Icons.MDFile className="h-5 w-5 stroke-semantic-fg-primary" />;
      case "FILE_TYPE_TEXT":
        return <Icons.TXTFile className="h-5 w-5 stroke-semantic-fg-primary" />;
      case "FILE_TYPE_PDF":
        return <Icons.PDFFile className="h-5 w-5 stroke-semantic-fg-primary" />;
      default:
        return <Icons.Check className="h-5 w-5 stroke-semantic-fg-primary" />;
    }
  }, [fileType]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content className="flex flex-col h-[90vh] max-w-[40vw]">
        <div className="flex-shrink-0 mb-3 flex flex-row space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line shadow-xs">
            {getFileIcon()}
          </div>
          <div className="flex flex-col min-w-0">
            <Dialog.Title className="truncate product-headings-heading-6 text-semantic-fg-disabled">
              {fileName}
            </Dialog.Title>
            <div className="truncate product-headings-heading-5 text-semantic-fg-primary">
              {fileType}
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
            <div
              className="h-full overflow-y-auto px-4 pb-4 text-semantic-fg-primary product-body-text-3-regular"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          )}
        </ScrollArea.Root>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>

  );
};

export default FileDetailsOverlay;