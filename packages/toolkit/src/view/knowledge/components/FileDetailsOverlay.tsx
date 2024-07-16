import React from 'react'
import { Icons, ScrollArea, Skeleton, Nullable, Dialog, Tabs } from '@instill-ai/design-system'
import { useGetFileDetails, useGetFileContent, useListChunks } from '../../../lib/react-query-service/knowledge';

type FileDetailsOverlayProps = {
    fileUid: string;
    accessToken: Nullable<string>;
    onClose: () => void;
    kbId: string;
    showFullFile: boolean;
    selectedChunkUid?: string;
    ownerId: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

const FileDetailsOverlay: React.FC<FileDetailsOverlayProps> = ({
    fileUid,
    accessToken,
    onClose,
    kbId,
    showFullFile,
    selectedChunkUid,
    ownerId,
    isOpen,
    setIsOpen
}) => {
    const { data: fileDetails, isLoading: isLoadingDetails } = useGetFileDetails({
        fileUid,
        accessToken,
        enabled: true,
        kbId,
        ownerId,
    });

    const { data: fileContent, isLoading: isLoadingContent } = useGetFileContent({
        fileUid,
        kbId,
        accessToken,
        enabled: true,
        ownerId,
    });

    const { data: chunks, isLoading: isLoadingChunks } = useListChunks({
        kbId,
        accessToken,
        enabled: !showFullFile,
        ownerId,
    });

    const highlightChunk = (content: string, chunkUid: string | undefined) => {
        if (showFullFile || !chunkUid) return content;

        const chunk = chunks?.find((c: { chunkUid: string; }) => c.chunkUid === chunkUid);
        if (!chunk) return content;

        const { startPos, endPos } = chunk;
        return (
            content.slice(0, startPos) +
            `<span style="background-color: yellow;">${content.slice(startPos, endPos)}</span>` +
            content.slice(endPos)
        );
    };

    const displayContent = fileContent ? highlightChunk(fileContent, selectedChunkUid) : '';

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <Dialog.Content className="!h-[90vh] !max-w-[90vw]">
                <div className="flex flex-col h-full">
                    <div className="mb-6 flex flex-row space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line">
                            {/* <Icons.File className="h-5 w-5 stroke-semantic-fg-primary" /> */}
                        </div>
                        <div className="flex flex-col">
                            <Dialog.Title>{isLoadingDetails ? <Skeleton className="h-6 w-32" /> : fileDetails?.name}</Dialog.Title>
                            <Dialog.Description>{isLoadingDetails ? <Skeleton className="h-6 w-24" /> : fileDetails?.type}</Dialog.Description>
                        </div>
                    </div>
                    <ScrollArea.Root className="h-full">
                        {isLoadingContent ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : (
                            <div
                                className="p-4 text-semantic-fg-primary product-body-text-3-regular"
                                dangerouslySetInnerHTML={{ __html: displayContent }}
                            />
                        )}
                    </ScrollArea.Root>
                </div>
                <Dialog.Close />
            </Dialog.Content>
        </Dialog.Root >
    )
}

export default FileDetailsOverlay