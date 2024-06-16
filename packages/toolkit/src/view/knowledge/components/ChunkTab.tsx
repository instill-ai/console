import { Button, Icons, Switch, Input, Tag } from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { useState } from "react";

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
  const [expandedFile, setExpandedFile] = useState(0);

  const toggleFileExpansion = (index: number) => {
    setExpandedFile(expandedFile === index ? -1 : index);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-2 mb-4">
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
      <div className="grid grid-cols-2 gap-4">
        {mockData.map((item, index) => (
          <div key={index}>
            <div
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => toggleFileExpansion(index)}
            >
              <p className="product-headings-heading-3">{item.fileName}</p>
              <Icons.ChevronDown
                className={`h-4 w-4 stroke-semantic-fg-primary transition-transform ${expandedFile === index ? "rotate-180" : ""
                  }`}
              />
            </div>
            {expandedFile === index && (
              <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="flex h-[185px] w-[360px] flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-2.5"
                  >
                    <div className="flex flex-col gap-y-2.5 p-2.5">
                      <div className="flex justify-between items-center">
                        <Tag size="sm" variant="lightNeutral">
                          <span className="product-body-text-3-medium mr-1.5">
                            {String(i + 1).padStart(3, "0")}
                          </span>
                        </Tag>
                        <div className="flex items-center gap-1">
                          <span className="product-body-text-3-medium uppercase">
                            {item.status ? "Retrievable" : "Unretrievable"}
                          </span>
                          <Switch
                            checked={item.status}
                            onCheckedChange={() => { }}
                            className="relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                          >
                            <span
                              aria-hidden="true"
                              className={`${item.status ? "translate-x-5" : "translate-x-0"
                                } pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                            />
                          </Switch>
                        </div>
                      </div>
                      <div className="h-px w-full bg-semantic-bg-line" />
                      <p className="product-body-text-2-regular text-semantic-fg-secondary-alt-secondary">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac justo vitae sem
                        ultricies consectetur. Import your own text data or write in real-time via Webhook to
                        enhance your LLM context. Effortlessly build a comprehensive knowledge base.
                      </p>
                      <div className="flex justify-end items-center gap-1">
                        <Tag size="sm" variant="lightNeutral">
                          <span className="product-body-text-3-medium">2,235</span>
                        </Tag>
                        <Tag size="sm" variant="lightNeutral">
                          <span className="product-body-text-3-medium">0</span>
                        </Tag>
                        <Tag size="sm" variant="lightNeutral">
                          <Icons.X className="h-2.5 w-2.5 mr-1" />
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
    </div>
  );
};