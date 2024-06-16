import {
  Button,
  Icons,
  Separator,
  Tag,
  Textarea,
  Select,
  Switch,
} from "@instill-ai/design-system";
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
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });

  const [selectedOption, setSelectedOption] = useState("Text");
  const [selectedTextOption, setSelectedTextOption] = useState("Markdown");

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
    <div className="w-[1160px] h-8 justify-start items-center gap-2 inline-flex">
      <div className="px-3 py-[9px] bg-white rounded border border-slate-200 justify-center items-center gap-2 flex">
        <div className="w-3.5 h-3.5 relative" />
        <div className="text-center text-gray-800 text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">add chunk</div>
      </div>
      <div className="h-8 justify-start items-start flex">
        <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
          <div className="self-stretch px-[9px] py-1.5 bg-white rounded border border-slate-200 justify-start items-center gap-2 inline-flex">
            <div className="w-4 h-4 relative" />
            <div className="grow shrink basis-0 h-5 justify-start items-center flex">
              <div className="grow shrink basis-0 text-gray-800/opacity-80 text-sm font-normal font-['IBM Plex Sans'] leading-tight">Search..</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};