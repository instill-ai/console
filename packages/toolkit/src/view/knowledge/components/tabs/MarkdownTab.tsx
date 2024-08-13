" use client";

import * as React from "react";

import {
  Button,
  Icons,
  Separator,
  // Select,
  Switch,
  Tag,
  Textarea,
} from "@instill-ai/design-system";

import { KnowledgeBase } from "../../../../lib/react-query-service/catalog/types";

type MarkdownTabProps = {
  knowledgeBase: KnowledgeBase;
};

const mockData = [
  {
    fileName: "file-a.pdf",
    fileType: "pdf",
    processedStatus: "30%",
    createTime: "Today 4:31pm",
    status: true,
  },
  {
    fileName: "file-b.txt",
    fileType: "txt",
    processedStatus: "60%",
    createTime: "Today 4:31pm",
    status: false,
  },
  {
    fileName: "file-c.jpg",
    fileType: "jpg",
    processedStatus: "12%",
    createTime: "Today 4:31pm",
    status: true,
  },
  {
    fileName: "file-d.png",
    fileType: "png",
    processedStatus: "25%",
    createTime: "Today 4:31pm",
    status: false,
  },
];

export const MarkdownTab = ({ knowledgeBase }: MarkdownTabProps) => {
  const [sortConfig, setSortConfig] = React.useState({
    key: "",
    direction: "",
  });

  // const [selectedOption, setSelectedOption] = useState("Text");
  // const [selectedTextOption, setSelectedTextOption] = useState("Markdown");

  const sortedData = [...mockData].sort((a, b) => {
    if (
      a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (
      a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]
    ) {
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
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
          {knowledgeBase.name}
        </p>
        {/* Coming in V2 */}
        <div className="space-x-4">
          <Button variant="secondaryGrey" size="lg">
            Publish
          </Button>
          <Button variant="secondaryGrey" size="lg">
            Update Catalog
          </Button>
          <Button variant="primary" size="lg">
            Export Data
          </Button>
        </div>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <div className="flex w-full flex-col gap-2">
        <div className="flex justify-start">
          <Button variant={"secondaryGrey"}>
            <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
            <div className="text-semantic-fg-primary product-body-text-3-semibold">
              Add File Markdown
            </div>
          </Button>
        </div>
        <div className="flex rounded border border-semantic-bg-line bg-semantic-bg-primary">
          <div className="flex flex-grow">
            <div className="flex flex-grow flex-col">
              <div className="flex items-center justify-center gap-3 border-b border-semantic-bg-line bg-semantic-bg-base-bg p-2">
                <div className="flex items-center gap-1">
                  <div className="text-semantic-fg-primary product-body-text-3-medium">
                    File name
                  </div>
                  <Button
                    variant="tertiaryGrey"
                    size="sm"
                    onClick={() => requestSort("fileName")}
                  >
                    {sortConfig.key === "fileName" &&
                      sortConfig.direction === "ascending" ? (
                      <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                    ) : (
                      <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                    )}
                  </Button>
                </div>
              </div>
              {sortedData.map((item, index) => (
                <div key={index}>
                  <div className="flex h-16 items-center justify-center px-3">
                    <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                      {item.fileName}
                    </div>
                  </div>
                  {index !== sortedData.length - 1 && (
                    <Separator orientation="horizontal" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-center gap-3 border-b border-semantic-bg-line bg-semantic-bg-base-bg p-2">
                <div className="flex items-center gap-1">
                  <div className="text-semantic-fg-primary product-body-text-3-medium">
                    File type
                  </div>
                  <Button
                    variant="tertiaryGrey"
                    size="sm"
                    onClick={() => requestSort("fileType")}
                  >
                    {sortConfig.key === "fileType" &&
                      sortConfig.direction === "ascending" ? (
                      <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                    ) : (
                      <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                    )}
                  </Button>
                </div>
              </div>
              {sortedData.map((item, index) => (
                <div key={index}>
                  <div className="flex h-16 items-center justify-center px-3">
                    <Tag size="sm" variant="lightNeutral">
                      {item.fileType}
                    </Tag>
                  </div>
                  {index !== sortedData.length - 1 && (
                    <Separator orientation="horizontal" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-center gap-3 border-b border-semantic-bg-line bg-semantic-bg-base-bg p-2">
                <div className="flex items-center gap-1">
                  <div className="text-semantic-fg-primary product-body-text-3-medium">
                    Processed results
                  </div>
                  <Button
                    variant="tertiaryGrey"
                    size="sm"
                    onClick={() => requestSort("processedStatus")}
                  >
                    {sortConfig.key === "processedStatus" &&
                      sortConfig.direction === "ascending" ? (
                      <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                    ) : (
                      <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                    )}
                  </Button>
                </div>
              </div>
              {sortedData.map((item, index) => (
                <div key={index}>
                  <div className="flex h-16 items-center justify-center px-3">
                    <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                      {item.processedStatus}
                    </div>
                  </div>
                  {index !== sortedData.length - 1 && (
                    <Separator orientation="horizontal" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-center gap-3 border-b border-semantic-bg-line bg-semantic-bg-base-bg p-2">
                <div className="flex items-center gap-1">
                  <div className="text-semantic-fg-primary product-body-text-3-medium">
                    Create time
                  </div>
                  <Button
                    variant="tertiaryGrey"
                    size="sm"
                    onClick={() => requestSort("createTime")}
                  >
                    {sortConfig.key === "createTime" &&
                      sortConfig.direction === "ascending" ? (
                      <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                    ) : (
                      <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                    )}
                  </Button>
                </div>
              </div>
              {sortedData.map((item, index) => (
                <div key={index}>
                  <div className="flex h-16 items-center justify-center px-3">
                    <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                      {item.createTime}
                    </div>
                  </div>
                  {index !== sortedData.length - 1 ? (
                    <Separator orientation="horizontal" />
                  ) : null}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-center gap-3 border-b border-semantic-bg-line bg-semantic-bg-base-bg p-2">
                <div className="flex items-center gap-1">
                  <div className="text-semantic-fg-primary product-body-text-3-medium">
                    Status
                  </div>
                  <Button
                    variant="tertiaryGrey"
                    size="sm"
                    onClick={() => requestSort("createTime")}
                  >
                    {sortConfig.key === "createTime" &&
                      sortConfig.direction === "ascending" ? (
                      <Icons.ChevronUp className="h-4 w-4 stroke-semantic-fg-secondary" />
                    ) : (
                      <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-secondary" />
                    )}
                  </Button>
                </div>
              </div>
              {sortedData.map((item, index) => (
                <div key={index}>
                  <div className="h-16 flex-col items-center justify-center px-3">
                    <div className=" product-label-label-2">Retrievable</div>
                    <Switch checked={item.status} onCheckedChange={() => { }} />
                  </div>
                  {index !== sortedData.length - 1 ? (
                    <Separator orientation="horizontal" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-[375px] flex-col gap-3 border-l border-semantic-bg-line pb-8">
            <div className="flex items-center justify-center gap-3 rounded-tr border-b border-semantic-bg-line bg-semantic-bg-base-bg p-3 pl-3">
              <div className="text-semantic-fg-primary product-body-text-3-medium">
                Preview
              </div>
            </div>
            <div className="flex h-full flex-col gap-3 px-8">
              <div className="flex flex-1 flex-col">
                <div className="flex h-full flex-col gap-1">
                  <div className="flex w-[311px] items-center justify-start pb-2.5">
                    <div className="flex items-start">
                      <div className="product-body-text-3-semibold">
                        File name
                      </div>
                    </div>
                  </div>
                  <Textarea
                    // {...field}
                    // id={field.name}
                    placeholder="Preview"
                    className="flex-1 flex-grow resize-none"
                  />
                </div>
              </div>
              <div className="flex items-start justify-end gap-3">
                <Button
                  variant="secondaryGrey"
                  size="lg"
                  className="capitalize"
                >
                  modify
                </Button>
                <Button
                  variant="secondaryGrey"
                  size="lg"
                  className="capitalize"
                >
                  download
                  <Icons.DownloadCloud01 className="ml-2 h-4 w-4 stroke-semantic-fg-primary" />
                </Button>
              </div>
              <Button
                variant="tertiaryDanger"
                size="lg"
                className="self-end capitalize"
              >
                delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
