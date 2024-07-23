"use client";
import { useRouter } from "next/navigation";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { Icons } from "@instill-ai/design-system";

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
  };

  const getTabClassName = (tabName: string, isSubTab = false) => {
    const baseClass = `flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${isSubTab ? "ml-4" : ""
      }`;

    if (activeTab === tabName || (isSubTab && selectedTextOption === tabName)) {
      return `${baseClass} bg-semantic-accent-bg text-semantic-accent-hover`;
    } else if (!selectedKnowledgeBase && tabName !== "knowledge-base") {
      return `${baseClass} cursor-not-allowed text-semantic-fg-disabled`;
    } else {
      return `${baseClass} cursor-pointer text-semantic-fg-secondary`;
    }
  };

  const getCatalogIconColor = () => {
    if (!selectedKnowledgeBase) {
      return 'stroke-semantic-fg-disabled';
    }
    if (activeTab === 'catalog') {
      return 'stroke-semantic-accent-hover';
    }
    return 'stroke-semantic-fg-secondary';
  };

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
            onTextOptionChange(null);
          }
        }}
      >
        <Icons.ChevronRight className={`w-4 h-4 ${getCatalogIconColor()}`} />
        Catalog
      </div>
      {activeTab === "catalog" && (
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
            Chunk
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