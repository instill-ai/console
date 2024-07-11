import { Icons, ScrollArea } from '@instill-ai/design-system'
import React from 'react'
import { FileSnippet } from '../../../lib/vdp-sdk/knowledge/types';

type FileProps = {
    file: FileSnippet;
};

const FileDetailsOverlay = ({ file }: FileProps) => {
    return (
        <div className="flex flex-col p-12 bg-semantic-bg-primary gap-4">
            <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-[10px] shadow border border-semantic-bg-line">
                    {/* <Icons.PDFIcon className="w-6 h-6" /> */}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-semantic-fg-disabled product-headings-heading-6">{file.fileName}</div>
                    <div className="text-semantic-fg-primary product-headings-heading-5">{file.sectionTitle}</div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <ScrollArea.Root>
                    <div className="p-4 text-semantic-fg-primary product-body-text-3-regular">
                        {file.chapters.map((chapter, index) => (
                            <div key={index} className="mb-4">
                                {chapter
                                    .filter((line) => !line.startsWith('Chapter'))
                                    .map((line, lineIndex) => (
                                        <React.Fragment key={lineIndex}>
                                            {line.startsWith('$') ? (
                                                <span className="bg-semantic-bg-secondary">{line.slice(1)}</span>
                                            ) : (
                                                <div>{line}</div>
                                            )}
                                        </React.Fragment>
                                    ))}
                            </div>
                        ))}
                    </div>
                </ScrollArea.Root>
            </div>
        </div>)
}

export default FileDetailsOverlay