// FileDetailsOverlay.tsx

import { Icons, ScrollArea } from '@instill-ai/design-system'
import React from 'react'
import { useGetFileDetails, useGetFileContent, useListChunks } from '../../../lib/react-query-service/knowledge';

type FileDetailsOverlayProps = {
    fileUid: string;
    accessToken: string;
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

    if (isLoadingDetails || isLoadingContent || (!showFullFile && isLoadingChunks)) {
        return <div>Loading...</div>;
    }

    if (!fileDetails || !fileContent || (!showFullFile && !chunks)) {
        return <div>Error loading file details or content</div>;
    }

    const highlightChunk = (content: string, chunkUid: string | undefined) => {
        if (showFullFile || !chunkUid) return content;

        const chunk = chunks.find(c => c.chunkUid === chunkUid);
        if (!chunk) return content;

        const { startPos, endPos } = chunk;
        return (
            content.slice(0, startPos) +
            `<span style="background-color: yellow;">${content.slice(startPos, endPos)}</span>` +
            content.slice(endPos)
        );
    };

    const displayContent = highlightChunk(fileContent, selectedChunkUid);

    return (
        <div className="flex flex-col p-12 bg-semantic-bg-primary gap-4">
            <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-[10px] shadow border border-semantic-bg-line">
                    {/* <Icons.PDFIcon className="w-6 h-6" /> */}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-semantic-fg-disabled product-headings-heading-6">{fileDetails.name}</div>
                    <div className="text-semantic-fg-primary product-headings-heading-5">{fileDetails.type}</div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <ScrollArea.Root>
                    <div
                        className="p-4 text-semantic-fg-primary product-body-text-3-regular"
                        dangerouslySetInnerHTML={{ __html: displayContent }}
                    />
                </ScrollArea.Root>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default FileDetailsOverlay