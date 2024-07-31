"use client";

import { useRouter } from "next/navigation";

import { Icons } from "@instill-ai/design-system";

import { KnowledgeBase } from "../../../lib/react-query-service/knowledge/types";

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedKnowledgeBase: KnowledgeBase | null;
  selectedTextOption: string | null;
  onTextOptionChange: (option: string | null) => void;
};

export const Sidebar = ({
  activeTab,
  onTabChange,
  selectedKnowledgeBase,
  selectedTextOption,
  onTextOptionChange,
}: SidebarProps) => {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    router.push(`#${tab}`, { scroll: false });

    if (tab === "catalog" && selectedKnowledgeBase) {
      onTextOptionChange("Files");
    }
  };

  const getTabClassName = (tabName: string, isSubTab = false) => {
    const baseClass = `flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${isSubTab ? "ml-4" : ""
      }`;
    const isActive =
      activeTab === tabName || (isSubTab && selectedTextOption === tabName);

    if (isActive) {
      return `${baseClass} bg-semantic-accent-bg text-semantic-accent-hover font-bold`;
    } else if (!selectedKnowledgeBase && tabName !== "knowledge-base") {
      return `${baseClass} cursor-not-allowed text-semantic-fg-disabled`;
    } else {
      return `${baseClass} cursor-pointer text-semantic-fg-secondary`;
    }
  };

  const getCatalogIconColor = () => {
    if (!selectedKnowledgeBase) {
      return "stroke-semantic-fg-disabled";
    }
    if (activeTab === "catalog") {
      return "stroke-semantic-accent-hover";
    }
    return "stroke-semantic-fg-secondary";
  };

  const isCatalogExpanded = activeTab === "catalog";

  return (
    <aside className="flex w-[160px] flex-col gap-y-4">
      <div
        className={`${getTabClassName("knowledge-base")} whitespace-nowrap`}
        onClick={() => handleTabChange("knowledge-base")}
      >
        My Knowledge Bases
      </div>
      <div
        className={getTabClassName("upload")}
        onClick={() => selectedKnowledgeBase && handleTabChange("upload")}
      >
        Upload Documents
      </div>
      <div
        className={getTabClassName("catalog")}
        onClick={() => {
          if (selectedKnowledgeBase) {
            handleTabChange("catalog");
          }
        }}
      >
        {isCatalogExpanded ? (
          <Icons.ChevronDown className={`w-4 h-4 ${getCatalogIconColor()}`} />
        ) : (
          <Icons.ChevronRight className={`w-4 h-4 ${getCatalogIconColor()}`} />
        )}
        Catalog
      </div>
      {isCatalogExpanded && (
        <>
          <div
            className={getTabClassName("Files", true)}
            onClick={() => {
              if (selectedKnowledgeBase) {
                handleTabChange("catalog");
                onTextOptionChange("Files");
              }
            }}
          >
            Files
          </div>
          <div
            className={getTabClassName("Chunk", true)}
            onClick={() => selectedKnowledgeBase && onTextOptionChange("Chunk")}
          >
            Chunks
          </div>
          {/* <div
            className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedTextOption === "Image"
              ? "bg-semantic-accent-bg text-semantic-accent-hover"
              : "cursor-pointer text-semantic-fg-secondary"
              }`}
            onClick={() => onTextOptionChange("Image")}
          >
            Image
          </div> */}
        </>
      )}
      <div
        className={getTabClassName("retrieve")}
        onClick={() => selectedKnowledgeBase && handleTabChange("retrieve")}
      >
        Chunk Search API
      </div>
    </aside>
  );
};
