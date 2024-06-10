import * as React from "react";
import { ScrollArea, Icons, PDFIcon } from "@instill-ai/design-system";
import { CitationSnippet } from "../../../lib/vdp-sdk/applications";

type CitationDetailsProps = {
    citation: CitationSnippet;
};

export const CitationDetails: React.FC<CitationDetailsProps> = ({ citation }) => {
    if (!citation.chapters) {
        return null;
    }

    return (
        <div className="flex flex-col p-12 bg-semantic-bg-primary gap-4">
            <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-[10px] shadow border border-semantic-bg-line">
                    <PDFIcon />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-semantic-fg-disabled product-headings-heading-6">{citation.fileName}</div>
                    <div className="text-semantic-fg-primary product-headings-heading-5">{citation.sectionTitle}</div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <ScrollArea.Root>
                    <div className="p-4 text-semantic-fg-primary product-body-text-3-regular">
                        {citation.chapters.map((chapter, index) => (
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
        </div>
    );
};