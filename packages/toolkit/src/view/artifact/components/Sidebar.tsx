"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KnowledgeBase, Nullable } from "instill-sdk";

import { cn, Icons } from "@instill-ai/design-system";

import type { KnowledgeBaseTabs } from "../types";

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: KnowledgeBaseTabs) => void;
  selectedKnowledgeBase: Nullable<KnowledgeBase>;
  onDeselectKnowledgeBase: () => void;
};

export const Sidebar = ({
  activeTab,
  onTabChange,
  selectedKnowledgeBase,
  onDeselectKnowledgeBase,
}: SidebarProps) => {
  const router = useRouter();
  const [isApiExpanded, setIsApiExpanded] = React.useState(false);

  const handleTabChange = (tab: KnowledgeBaseTabs) => {
    if (tab === "knowledge_bases") {
      onDeselectKnowledgeBase();
    }
    onTabChange(tab);
    router.push(`#${tab}`, { scroll: false });
  };

  const getTabClassName = (tabName: string) =>
    cn(
      "flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2",
      activeTab === tabName
        ? "bg-semantic-accent-bg text-semantic-accent-hover font-bold"
        : "cursor-pointer text-semantic-fg-secondary",
    );

  const isApiTabActive = ["retrieve"].includes(activeTab);

  React.useEffect(() => {
    if (isApiTabActive) {
      setIsApiExpanded(true);
    }
  }, [isApiTabActive]);

  const handleApiClick = () => {
    const newExpandedState = !isApiExpanded;
    setIsApiExpanded(newExpandedState);
    if (newExpandedState && !isApiTabActive) {
      handleTabChange("retrieve");
    }
  };

  return (
    <aside className="flex w-[160px] flex-col gap-y-4">
      <div
        className={cn(getTabClassName("knowledge_bases"), "whitespace-nowrap")}
        onClick={() => handleTabChange("knowledge_bases")}
      >
        {selectedKnowledgeBase && activeTab !== "knowledge_bases" ? (
          <Icons.ArrowLeft className="h-4 w-4 stroke-semantic-fg-secondary mr-1 flex-shrink-0" />
        ) : null}
        My Knowledge Bases
      </div>
      {selectedKnowledgeBase ? (
        <>
          <div
            className={getTabClassName("upload")}
            onClick={() => handleTabChange("upload")}
          >
            Upload Documents
          </div>
          <div
            className={getTabClassName("files")}
            onClick={() => handleTabChange("files")}
          >
            Files
          </div>
          <div
            className={getTabClassName("chunks")}
            onClick={() => handleTabChange("chunks")}
          >
            Chunks
          </div>
          <div
            className="flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 cursor-pointer text-semantic-fg-secondary"
            onClick={handleApiClick}
          >
            <Icons.ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200 stroke-semantic-fg-secondary",
                isApiExpanded ? "transform rotate-180" : "",
              )}
            />
            API
          </div>
          {isApiExpanded ? (
            <>
              <div
                className={cn(getTabClassName("retrieve"), "ml-4")}
                onClick={() => handleTabChange("retrieve")}
              >
                Search Chunks
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </aside>
  );
};
