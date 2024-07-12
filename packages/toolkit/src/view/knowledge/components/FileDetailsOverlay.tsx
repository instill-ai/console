import { Icons, ScrollArea } from '@instill-ai/design-system'
import React from 'react'
import { useGetFileDetails, useGetFileContent } from '../../../lib/react-query-service/knowledge';

type FileDetailsOverlayProps = {
    fileUid: string;
    accessToken: string;
    onClose: () => void;
    kbId: string;
};

const FileDetailsOverlay: React.FC<FileDetailsOverlayProps> = ({ fileUid, accessToken, onClose, kbId }) => {
    const { data: fileDetails, isLoading: isLoadingDetails } = useGetFileDetails({
        fileUid,
        accessToken,
        enabled: true,
        kbId,
    });

    const { data: fileContent, isLoading: isLoadingContent } = useGetFileContent({
        fileUid,
        kbId,
        accessToken,
        enabled: true,
    });

    if (isLoadingDetails || isLoadingContent) {
        return <div>Loading...</div>;
    }

    if (!fileDetails || !fileContent) {
        return <div>Error loading file details or content</div>;
    }

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
                    <div className="p-4 text-semantic-fg-primary product-body-text-3-regular">
                        {fileContent.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                </ScrollArea.Root>
            </div>
        </div>
    )
}

export default FileDetailsOverlay