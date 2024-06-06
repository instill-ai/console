import * as React from "react";
import { Dialog, ScrollArea, Separator, Tag, Icons } from "@instill-ai/design-system";
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
        <div className="w-[605px] h-[684px] p-12 bg-white justify-start items-start gap-2 inline-flex">
            <div className="flex-col justify-start items-start gap-3 inline-flex">
                <div className="justify-start items-start gap-2 inline-flex">
                    <div className="w-12 h-12 p-3 bg-white rounded-[10px] shadow border border-slate-200 justify-center items-center flex">
                        <div className="w-6 h-6 relative flex-col justify-start items-start flex">
                            <div className="w-[19.20px] h-6 relative">
                                <Icons.X className="w-full h-full" />
                            </div>
                            <div className="w-[19.20px] text-center text-white text-[9px] font-bold font-['IBM Plex Sans']">
                                PDF
                            </div>
                        </div>
                    </div>
                    <div className="flex-col justify-start items-start gap-2 inline-flex">
                        <div className="text-gray-800/opacity-60 text-sm font-medium font-['IBM Plex Sans'] leading-none">
                            {snippet.fileName}
                        </div>
                        <div className="text-black text-base font-medium font-['IBM Plex Sans'] leading-tight">
                            Citation Details
                        </div>
                    </div>
                </div>
                <div className="w-[509px] h-[528px] pt-2 flex-col justify-start items-start gap-[21px] flex">
                    <div className="self-stretch h-[21px] flex-col justify-start items-start flex">
                        <div className="self-stretch text-gray-800 text-sm font-normal font-['IBM Plex Sans'] leading-[21px] tracking-tight">
                            Citation Details:
                        </div>
                    </div>
                    <div className="self-stretch h-[394px] pl-7 flex-col justify-start items-start gap-2 flex">
                        <ScrollArea.Root
                            className={cn(
                                "nowheel h-[394px] rounded-sm p-2",
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
            </div>
            <div className="p-2 rounded justify-center items-center flex">
                <Dialog.Close className="!static !h-6 !w-6">
                    {/* <Icons.X className="h-6 w-6" /> */}
                </Dialog.Close>
            </div>
            <div className="w-4 h-[520px] p-1 justify-start items-start gap-2.5 flex">
                <div className="w-2 h-[512px] pb-96 flex-col justify-start items-center inline-flex">
                    <div className="w-2 h-32 bg-gray-200 rounded-lg" />
                </div>
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