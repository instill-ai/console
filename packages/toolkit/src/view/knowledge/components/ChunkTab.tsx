import { Button, Icons, Switch, Input, Tag } from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { useState } from "react";
import MetadataPreview from "./MetadataPreview";

type ChunkTabProps = {
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

export const ChunkTab = ({ knowledgeBase }: ChunkTabProps) => {
  const [expandedFiles, setExpandedFiles] = useState<number[]>([0]);

  const toggleFileExpansion = (index: number) => {
    if (expandedFiles.includes(index)) {
      setExpandedFiles(expandedFiles.filter((fileIndex) => fileIndex !== index));
    } else {
      setExpandedFiles([...expandedFiles, index]);
    }
  };

  return (
    <div className="flex">
      <div className="w-2/3 pr-4">
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="secondaryGrey">
            <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary mr-2" />
            <span className="product-body-text-3-semibold">Add File Chunk</span>
          </Button>
          <Input.Root className="w-1/3">
            <Input.LeftIcon>
              <Icons.SearchSm className="h-4 w-4 stroke-semantic-fg-primary" />
            </Input.LeftIcon>
            <Input.Core placeholder="Search..." />
          </Input.Root>
        </div>
        {mockData.map((item, index) => (
          <div key={index} className="mb-4">
            <div
              className="flex items-center space-x-2 mb-2 cursor-pointer"
              onClick={() => toggleFileExpansion(index)}
            >
              <p className="product-button-button-1">{item.fileName}</p>
              <Icons.ChevronDown
                className={`h-4 w-4 stroke-semantic-fg-primary transition-transform ${expandedFiles.includes(index) ? "rotate-180" : ""
                  }`}
              />
            </div>
            {expandedFiles.includes(index) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-2.5"
                  >
                    <div className="flex flex-col gap-y-2.5 p-2.5">
                      <div className="flex justify-between items-center">
                        <Tag size="sm" variant="default" className="!rounded">
                          <span className="product-body-text-3-medium mr-1.5">
                            {String(i + 1).padStart(3, "0")}
                          </span>
                        </Tag>
                        <div className="flex items-center gap-1">
                          <span className="product-label-label-1 uppercase">
                            {item.status ? "Retrievable" : "Unretrievable"}
                          </span>
                          <Switch
                            checked={item.status}
                            onCheckedChange={() => { }}
                            className=""
                          ></Switch>
                        </div>
                      </div>
                      <div className="h-px w-full bg-semantic-bg-line" />
                      <p className="product-body-text-2-regular text-semantic-fg-secondary-alt-secondary line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac justo vitae sem
                        ultricies consectetur. Import your own text data or write in real-time via Webhook to
                        enhance your LLM context. Effortlessly build a comprehensive knowledge base.
                      </p>
                      <div className="flex justify-end items-center gap-1">
                        <Tag size="sm" variant="default" className="!rounded">
                          <Icons.Type01 className="h-2.5 w-2.5 mr-1 stroke-semantic-fg-primary" />
                          <span className="product-body-text-3-medium">2,235</span>
                        </Tag>
                        <Tag size="sm" variant="default" className="!rounded">
                          <Icons.Type01 className="h-2.5 w-2.5 mr-1 stroke-semantic-fg-primary" />
                          <span className="product-body-text-3-medium">0</span>
                        </Tag>
                        <Tag size="sm" variant="default" className="!rounded">
                          <Icons.Type01 className="h-2.5 w-2.5 mr-1 stroke-semantic-fg-primary" />
                          <span className="product-body-text-3-medium">2cfefe7706...</span>
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
  );
};