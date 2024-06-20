import {
  Button,
  Icons,
  LinkButton,
  Separator,
  Tag,
  Textarea,
} from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import * as React from "react";
import { DELETE_FILE_TIMEOUT } from "./undoDeleteTime";

type CatalogFilesTabProps = {
  knowledgeBase: KnowledgeBase;
};

const mockData = [
  {
    fileName: "file-a.pdf",
    fileType: "pdf",
    processedStatus: "30%",
    createTime: "Today 1:34pm",
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
    createTime: "Today 7:29pm",
  },
  {
    fileName: "file-d.png",
    fileType: "png",
    processedStatus: "25%",
    createTime: "Today 11:11pm",
  },
];

export const CatalogFilesTab = ({ knowledgeBase }: CatalogFilesTabProps) => {
  const [sortConfig, setSortConfig] = React.useState({
    key: "",
    direction: "",
  });
  const [data, setData] = React.useState(mockData);
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [deletedFile, setDeletedFile] = React.useState<typeof mockData[number] | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const sortedData = [...data].sort((a, b) => {
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
  const handleDelete = (fileName: string) => {
    const fileToDelete = data.find((item) => item.fileName === fileName);
    if (fileToDelete) {
      setDeletedFile(fileToDelete);
      setData((prevData) => prevData.filter((item) => item.fileName !== fileName));
      setShowDeleteMessage(true);
      timeoutRef.current = setTimeout(() => {
        setShowDeleteMessage(false);
        setDeletedFile(null);
      }, DELETE_FILE_TIMEOUT);
    }
  };

  const undoDelete = () => {
    if (deletedFile) {
      setData((prevData) => [...prevData, deletedFile]);
      setShowDeleteMessage(false);
      setDeletedFile(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

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
          {/* <Button variant="secondaryGrey" size="lg">
            Publish
          </Button>
          <Button variant="secondaryGrey" size="lg">
            Update Knowledge Base
          </Button> */}
          <Button variant="primary" size="lg">
            Export Data
          </Button>
        </div>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <div className="flex w-full flex-col gap-2">
        {/* <div className="flex justify-start">
          <Button variant={"secondaryGrey"}>
            <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
            <div className="text-semantic-fg-primary product-body-text-3-semibold">
              Add File
            </div>
          </Button>
        </div> */}
        <div className="flex rounded border border-semantic-bg-line bg-semantic-bg-primary">
          <div className="flex flex-col w-full">
            <div className="grid grid-cols-9 items-center h-[72px] border-b border-semantic-bg-line bg-semantic-bg-base-bg">
              <div className="col-span-5 flex items-center justify-center gap-1">
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
              <div className="flex items-center justify-center gap-1">
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
              <div className="flex items-center justify-center gap-1">
                <div className="text-semantic-fg-primary product-body-text-3-medium">
                  Processed status
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
              <div className="flex items-center justify-center gap-1">
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
              <div className="flex items-center justify-center gap-1">
                <div className="text-semantic-fg-primary product-body-text-3-medium">
                  Delete File
                </div>
              </div>
            </div>
            {sortedData.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-9 items-center h-[72px] ${index !== sortedData.length - 1 ? "border-b border-semantic-bg-line" : ""
                  }`}
              >
                <div className="col-span-5 flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  {item.fileName}
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <Tag size="sm" variant="lightNeutral">
                    {item.fileType}
                  </Tag>
                </div>
                <div className="col-span-1 flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  {item.processedStatus}
                </div>
                <div className="col-span-1 flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                  {item.createTime}
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <Button
                    variant="tertiaryDanger"
                    size="lg"
                    className="h-8"
                    onClick={() => handleDelete(item.fileName)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="flex w-[375px] flex-col gap-3 border-l border-semantic-bg-line pb-8">
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
          </div> */}
          {showDeleteMessage && deletedFile ? (
            <div className="fixed bottom-4 right-8 flex h-[136px] w-[400px] rounded-lg border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
              <Icons.AlertTriangle className="mr-4 h-6 w-6 stroke-semantic-warning-on-bg" />
              <div className="mr-4 shrink grow basis-0 flex-col items-start justify-start space-y-4">
                <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                  <div className="self-stretch product-body-text-2-semibold">
                    {deletedFile.fileName} has been deleted
                  </div>
                  <div className="self-stretch text-semantic-fg-secondary product-body-text-3-regular">
                    If this was a mistake, click &quot;Undo Action&quot; to reapply your changes.
                  </div>
                </div>
                <LinkButton
                  className="!p-0"
                  variant="secondary"
                  size="md"
                  onClick={undoDelete}
                >
                  Undo Action
                </LinkButton>
              </div>
              <Button
                className="absolute right-2 top-2"
                variant="tertiaryGrey"
                size="sm"
                onClick={() => setShowDeleteMessage(false)}
              >
                <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};