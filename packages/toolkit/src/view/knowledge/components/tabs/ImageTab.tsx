import { useState } from "react";

import {
  Button,
  cn,
  Icons,
  Input,
  Separator,
  Switch,
  Tag,
} from "@instill-ai/design-system";

import { KnowledgeBase } from "../../../../lib/react-query-service/knowledge/types";
import MetadataPreview from "../MetadataPreview";

type ImageTabProps = {
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

export const ImageTab = ({ knowledgeBase }: ImageTabProps) => {
  const [expandedFiles, setExpandedFiles] = useState<number[]>([0]);

  const toggleFileExpansion = (index: number) => {
    if (expandedFiles.includes(index)) {
      setExpandedFiles(
        expandedFiles.filter((fileIndex) => fileIndex !== index),
      );
    } else {
      setExpandedFiles([...expandedFiles, index]);
    }
  };

  return (
    <div className="flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
          {knowledgeBase.name}
        </p>
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
      <div className="flex">
        <div className="w-2/3 pr-4">
          <div className="mb-4 flex items-center space-x-2">
            <Button variant="secondaryGrey">
              <Icons.Plus className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
              <span className="product-body-text-3-semibold">Add Image</span>
            </Button>
            <Input.Root className="w-1/3">
              <Input.LeftIcon>
                <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
              </Input.LeftIcon>
              <Input.Core placeholder="Search..." />
            </Input.Root>
          </div>
          {mockData.map((item, index) => (
            <div key={index} className="mb-4">
              <div
                className="mb-2 flex cursor-pointer items-center space-x-2"
                onClick={() => toggleFileExpansion(index)}
              >
                <p className=" product-button-button-1">{item.fileName}</p>
                <Icons.ChevronDown
                  className={cn(
                    "h-4 w-4 stroke-semantic-fg-primary transition-transform",
                    { "rotate-180": expandedFiles.includes(index) },
                  )}
                />
              </div>
              {expandedFiles.includes(index) && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-2.5"
                    >
                      <div className="flex flex-col gap-y-2.5 p-2.5">
                        <div className="flex items-center justify-between">
                          <Tag size="sm" variant="default" className="!rounded">
                            <span className="mr-1.5 product-body-text-3-medium">
                              {String(i + 1).padStart(3, "0")}
                            </span>
                          </Tag>
                          <div className="flex items-center gap-1">
                            <span className=" uppercase product-label-label-1">
                              {item.status ? "Retrievable" : "Unretrievable"}
                            </span>
                            <Switch
                              checked={item.status}
                              onCheckedChange={() => {}}
                              className=""
                            ></Switch>
                          </div>
                        </div>
                        <div className="h-px w-full bg-semantic-bg-line" />
                        <p className="text-semantic-fg-secondary-alt-secondary line-clamp-3 product-body-text-2-regular">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Fusce ac justo vitae sem ultricies consectetur.
                          Import your own text data or write in real-time via
                          Webhook to enhance your LLM context. Effortlessly
                          build a comprehensive catalog.
                        </p>
                        <div className="flex items-center justify-end gap-1">
                          <Tag size="sm" variant="default" className="!rounded">
                            <Icons.Type01 className="mr-1 h-2.5 w-2.5 stroke-semantic-fg-primary" />
                            <span className="product-body-text-3-medium">
                              2,235
                            </span>
                          </Tag>
                          <Tag size="sm" variant="default" className="!rounded">
                            <Icons.Type01 className="mr-1 h-2.5 w-2.5 stroke-semantic-fg-primary" />
                            <span className="product-body-text-3-medium">
                              0
                            </span>
                          </Tag>
                          <Tag size="sm" variant="default" className="!rounded">
                            <Icons.Type01 className="mr-1 h-2.5 w-2.5 stroke-semantic-fg-primary" />
                            <span className="product-body-text-3-medium">
                              2cfefe7706...
                            </span>
                          </Tag>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-1/3">
          <MetadataPreview />
        </div>
      </div>
    </div>
  );
};
