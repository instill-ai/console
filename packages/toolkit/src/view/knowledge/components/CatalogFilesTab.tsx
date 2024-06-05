{/* This tab is coming in V2 */ }


import { Button, Icons, Separator, Tag, Textarea } from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { useState } from "react";

type CatalogFilesTabProps = {
    knowledgeBase: KnowledgeBase;
};

const mockData = [
    {
        fileName: "file-a.pdf",
        fileType: "pdf",
        processedStatus: "30%",
        createTime: "Today 4:31pm",
    },
    {
        fileName: "file-b.txt",
        fileType: "txt",
        processedStatus: "60%",
        createTime: "Today 4:31pm",
    },
    {
        fileName: "file-c.jpg",
        fileType: "jpg",
        processedStatus: "12%",
        createTime: "Today 4:31pm",
    },
    {
        fileName: "file-d.png",
        fileType: "png",
        processedStatus: "25%",
        createTime: "Today 4:31pm",
    },
];

export const CatalogFilesTab = ({ knowledgeBase }: CatalogFilesTabProps) => {
    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "",
    });

    const sortedData = [...mockData].sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key: string) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-5">
                <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                    {knowledgeBase.name}
                </p>
                {/* Coming in V2 */}
                {/* <div className="space-x-4">
                    <Button variant="secondaryGrey" size="lg">
                        Publish
                    </Button>
                    <Button variant="secondaryGrey" size="lg">
                        Update Knowledge Base
                    </Button>
                    <Button variant="primary" size="lg">
                        Export Data
                    </Button>
                </div> */}
            </div>
            <Separator orientation="horizontal" className="mb-6" />
            <div className="w-full flex flex-col gap-2">
                <div className="flex justify-start">
                    <div className="px-3 py-2 bg-semantic-bg-primary rounded border border-semantic-bg-line flex items-center gap-2">
                        <Icons.Plus className="w-4 h-4 stroke-semantic-fg-secondary" />
                        <div className="text-semantic-fg-primary product-body-text-3-semibold">Add File</div>
                    </div>
                </div>
                <div className="bg-semantic-bg-primary  rounded border border-semantic-bg-line flex">
                    <div className="flex-grow flex">
                        <div className="flex-grow flex flex-col">
                            <div className="p-2 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center justify-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-semantic-fg-primary product-body-text-3-medium">File name</div>
                                    <Button
                                        variant="tertiaryGrey"
                                        size="sm"
                                        onClick={() => requestSort("fileName")}
                                    >
                                        {sortConfig.key === "fileName" && sortConfig.direction === "ascending" ? (
                                            <Icons.ChevronUp className="w-4 h-4 stroke-semantic-fg-secondary" />
                                        ) : (
                                            <Icons.ChevronDown className="w-4 h-4 stroke-semantic-fg-secondary" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {sortedData.map((item, index) => (
                                <div key={index}>
                                    <div className="px-3 flex items-center justify-center h-16">
                                        <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                                            {item.fileName}
                                        </div>
                                    </div>
                                    {index !== sortedData.length - 1 && <Separator orientation="horizontal" />}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="p-2 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center justify-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-semantic-fg-primary product-body-text-3-medium">File type</div>
                                    <Button
                                        variant="tertiaryGrey"
                                        size="sm"
                                        onClick={() => requestSort("fileType")}
                                    >
                                        {sortConfig.key === "fileType" && sortConfig.direction === "ascending" ? (
                                            <Icons.ChevronUp className="w-4 h-4 stroke-semantic-fg-secondary" />
                                        ) : (
                                            <Icons.ChevronDown className="w-4 h-4 stroke-semantic-fg-secondary" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {sortedData.map((item, index) => (
                                <div key={index}>
                                    <div className="px-3 flex items-center justify-center h-16">
                                        <Tag size="sm" variant="lightNeutral">
                                            {item.fileType}
                                        </Tag>
                                    </div>
                                    {index !== sortedData.length - 1 && <Separator orientation="horizontal" />}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="p-2 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center justify-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-semantic-fg-primary product-body-text-3-medium">
                                        Processed status
                                    </div>
                                    <Button
                                        variant="tertiaryGrey"
                                        size="sm"
                                        onClick={() => requestSort("processedStatus")}
                                    >
                                        {sortConfig.key === "processedStatus" && sortConfig.direction === "ascending" ? (
                                            <Icons.ChevronUp className="w-4 h-4 stroke-semantic-fg-secondary" />
                                        ) : (
                                            <Icons.ChevronDown className="w-4 h-4 stroke-semantic-fg-secondary" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {sortedData.map((item, index) => (
                                <div key={index}>
                                    <div className="px-3 flex items-center justify-center h-16">
                                        <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                                            {item.processedStatus}
                                        </div>
                                    </div>
                                    {index !== sortedData.length - 1 && <Separator orientation="horizontal" />}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="p-2 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center justify-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-semantic-fg-primary product-body-text-3-medium">Create time</div>
                                    <Button
                                        variant="tertiaryGrey"
                                        size="sm"
                                        onClick={() => requestSort("createTime")}
                                    >
                                        {sortConfig.key === "createTime" && sortConfig.direction === "ascending" ? (
                                            <Icons.ChevronUp className="w-4 h-4 stroke-semantic-fg-secondary" />
                                        ) : (
                                            <Icons.ChevronDown className="w-4 h-4 stroke-semantic-fg-secondary" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {sortedData.map((item, index) => (
                                <div key={index}>
                                    <div className="px-3 flex items-center justify-center h-16">
                                        <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                                            {item.createTime}
                                        </div>
                                    </div>
                                    {index !== sortedData.length - 1 && <Separator orientation="horizontal" />}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-[375px] border-l border-semantic-bg-line flex flex-col gap-3 pb-8">
                        <div className="pl-3 p-3 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center justify-center gap-3 rounded-tr">
                            <div className="text-semantic-fg-primary product-body-text-3-medium">Preview</div>
                        </div>
                        <div className="px-8 flex flex-col h-full gap-3">
                            <div className="flex flex-col flex-1">
                                <div className="flex flex-col h-full gap-1">
                                    <div className="w-[311px] pb-2.5 flex items-center justify-start">
                                        <div className="flex items-start">
                                            <div className="product-body-text-3-semibold">File name</div>
                                        </div>
                                    </div>
                                    <Textarea
                                        // {...field}
                                        // id={field.name}
                                        placeholder="Preview"
                                        className="flex-1 resize-none flex-grow"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end items-start gap-3">
                                <Button variant="secondaryGrey" size="lg" className="capitalize">
                                    modify
                                </Button>
                                <Button variant="secondaryGrey" size="lg" className="capitalize">
                                    download
                                    <Icons.DownloadCloud01 className="w-4 h-4 stroke-semantic-fg-primary ml-2" />
                                </Button>
                            </div>
                            <Button variant="tertiaryDanger" size="lg" className="capitalize self-end">
                                delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};