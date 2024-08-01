"use client";

import { useRouter } from "next/navigation";

import { KnowledgeBase } from "../../../lib/react-query-service/knowledge/types";

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedKnowledgeBase: KnowledgeBase | null;
};

export const Sidebar = ({
  activeTab,
  onTabChange,
  selectedKnowledgeBase,
}: SidebarProps) => {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    router.push(`#${tab}`, { scroll: false });
  };

  const getTabClassName = (tabName: string) => {
    const baseClass =
      "flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2";
    const isActive = activeTab === tabName;

    if (isActive) {
      return `${baseClass} bg-semantic-accent-bg text-semantic-accent-hover font-bold`;
    } else if (!selectedKnowledgeBase && tabName !== "catalog") {
      return `${baseClass} cursor-not-allowed text-semantic-fg-disabled`;
    } else {
      return `${baseClass} cursor-pointer text-semantic-fg-secondary`;
    }
  };

  return (
    <aside className="flex w-[160px] flex-col gap-y-4">
      <div
        className={`${getTabClassName("catalog")} whitespace-nowrap`}
        onClick={() => handleTabChange("catalog")}
      >
        My Catalogs
      </div>
      <div
        className={getTabClassName("upload")}
        onClick={() => selectedKnowledgeBase && handleTabChange("upload")}
      >
        Upload Documents
      </div>
      <div
        className={getTabClassName("files")}
        onClick={() => selectedKnowledgeBase && handleTabChange("files")}
      >
        Files
      </div>
      <div
        className={getTabClassName("chunks")}
        onClick={() => selectedKnowledgeBase && handleTabChange("chunks")}
      >
        Chunks
      </div>
      <div
        className={getTabClassName("retrieve")}
        onClick={() => selectedKnowledgeBase && handleTabChange("retrieve")}
      >
        Chunk Search API
      </div>
    </aside>
  );
};
