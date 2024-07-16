import { Icons, ScrollArea, Skeleton, Nullable } from '@instill-ai/design-system'
import React from 'react'
import { useGetFileDetails, useGetFileContent, useListChunks } from '../../../lib/react-query-service/knowledge';

type FileDetailsOverlayProps = {
    fileUid: string;
    accessToken: Nullable<string>;
    onClose: () => void;
    kbId: string;
    showFullFile: boolean;
    selectedChunkUid?: string;
    ownerId: string;
};

const FileDetailsOverlay: React.FC<FileDetailsOverlayProps> = ({
    fileUid,
    accessToken,
    onClose,
    kbId,
    showFullFile,
    selectedChunkUid,
    ownerId
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 h-3/4 bg-semantic-bg-primary rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-[10px] shadow border border-semantic-bg-line">
                                {/* <Icons.PDFIcon className="w-6 h-6" /> */}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-semantic-fg-disabled product-headings-heading-6">
                                    {isLoadingDetails ? <Skeleton className="h-6 w-32" /> : fileDetails?.name}
                                </div>
                                <div className="text-semantic-fg-primary product-headings-heading-5">
                                    {isLoadingDetails ? <Skeleton className="h-6 w-24" /> : fileDetails?.type}
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-semantic-fg-secondary hover:text-semantic-fg-primary">
                            <Icons.X className="w-6 h-6" />
                        </button>
                    </div>
                    <ScrollArea.Root className="flex-grow">
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
            </div>
        </div>
    )
}

export default FileDetailsOverlay