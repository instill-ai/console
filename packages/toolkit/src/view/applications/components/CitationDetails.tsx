import * as React from "react";
import { Dialog, ScrollArea, Separator, Tag, Icons, Button } from "@instill-ai/design-system";
import cn from "clsx";

type CitationDetailsProps = {
    snippet: {
        id: string;
        content: string;
        fileName: string;
    };
};

export const CitationDetails: React.FC<CitationDetailsProps> = ({ snippet }) => {
    return (
        <div className="w-[400px] bg-white rounded-lg shadow-lg">
            <Dialog.Close className="!static !h-6 !w-6" />

            <div className="p-4">
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Citation Details</h2>

                </div>
                <ScrollArea.Root
                    className={cn(
                        "nowheel h-[216px] rounded-sm p-2",
                        "border border-semantic-bg-line"
                    )}
                >
                    <div className="flex h-full flex-col gap-y-2">
                        <div className="p-5 bg-semantic-bg-default rounded-sm shadow border border-semantic-bg-line space-y-2.5">
                            <Tag size="md" variant="default" className="!rounded bg-semantic-bg-base-bg">
                                {snippet.id}
                            </Tag>
                            <Separator />
                            <p className="text-semantic-fg-muted text-sm mb-2">{snippet.content}</p>
                            <div className="flex justify-end">
                                <Tag size="sm" variant="lightGreen" className="!rounded">
                                    {snippet.fileName}
                                </Tag>
                            </div>
                        </div>
                    </div>
                </ScrollArea.Root>
            </div>
        </div>
    );
};

export const mockSnippets = [
    {
        id: "citation-01",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac justo vitae sem ultricies consectetur. Import your own text data or write in real-time via Webhook to enhance your LLM context. Effortlessly build a comprehensive knowledge base.",
        fileName: "file1.pdf",
    },
    {
        id: "citation-02",
        content:
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        fileName: "file2.pdf",
    },
];