import * as React from "react";
import { Icons, Separator, ScrollArea, Tag } from "@instill-ai/design-system";
import { CitationSnippet } from "../../../lib/vdp-sdk/applications/types";

type SidebarProps = {
    mockCitations: CitationSnippet[];
};

export const Sidebar: React.FC<SidebarProps> = ({ mockCitations }) => {
    return (
        <div className="w-[400px] flex flex-col bg-semantic-bg-surface rounded shadow">
            <div className="py-2 px-3 product-body-text-1-semibold bg-semantic-bg-base-bg rounded-t border-b border-semantic-bg-line">
                Parameters
            </div>
            <div className="flex flex-col p-6 gap-4">
                <div className="product-headings-heading-5">Statistics</div>
                <div className="flex-col text-semantic-fg-secondary bg-semantic-bg-base-bg rounded px-4 py-2 gap-y-1">
                    <div className="flex">
                        <span className="font-semibold">Reply time:</span>
                        <span className="">19s</span>
                    </div>
                    <div className="flex">
                        <span className="font-semibold">Cost:</span>
                        <span className="">$0.011</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="product-headings-heading-5">Retrieved Snippets</div>
                    <ScrollArea.Root className="h-96">
                        <div className="space-y-4">
                            {mockCitations.map((citation) => (
                                <div
                                    key={citation.id}
                                    className="p-5 bg-semantic-bg-default rounded-sm shadow border border-semantic-bg-line space-y-2.5"
                                >
                                    <Tag size="md" variant="default" className="!rounded bg-semantic-bg-base-bg">
                                        Top{citation.id.split("-")[1]}: 0.00{citation.id.split("-")[1]}
                                    </Tag>
                                    <Separator />
                                    <p className="product-body-text-3-regular text-semantic-fg-secondary">
                                        {citation.content}
                                    </p>
                                    <div className="flex justify-end">
                                        <Tag size="sm" variant="lightGreen" className="!rounded gap-x-1">
                                            <Icons.File05 className="stroke-semantic-success-hover h-2.5 w-2.5" />
                                            Original file name.pdf
                                        </Tag>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea.Root>
                </div>
                <div className="flex-col items-center gap-2">
                    <span className="text-semantic-fg-default product-button-button-2">
                        Pipeline in use:
                    </span>
                    <div className="flex items-center space-x-1 hover:underline hover:cursor-pointer">
                        <Icons.Pipeline className="h-4 w-4 stroke-semantic-accent-default" />
                        <span className="text-semantic-accent-default product-button-button-2">
                            xiaofei/name-your-pet
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};