import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";

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
  return (
    <aside className="flex w-[160px] flex-col gap-y-4">
      <div
        className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${
          activeTab === "knowledge-base"
            ? "bg-semantic-accent-bg text-semantic-accent-hover"
            : "cursor-pointer text-semantic-fg-secondary"
        }`}
        onClick={() => onTabChange("knowledge-base")}
      >
        My Knowledge Bases
      </div>
      <div
        className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${
          activeTab === "upload"
            ? "bg-semantic-accent-bg text-semantic-accent-hover"
            : selectedKnowledgeBase
              ? "cursor-pointer text-semantic-fg-secondary"
              : "cursor-not-allowed text-semantic-fg-secondary opacity-50"
        }`}
        onClick={() => selectedKnowledgeBase && onTabChange("upload")}
      >
        Upload & Explore
      </div>
      <div
        className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${
          activeTab === "catalog"
            ? "bg-semantic-accent-bg text-semantic-accent-hover"
            : selectedKnowledgeBase
              ? "cursor-pointer text-semantic-fg-secondary"
              : "cursor-not-allowed text-semantic-fg-secondary opacity-50"
        }`}
        onClick={() => selectedKnowledgeBase && onTabChange("catalog")}
      >
        Catalog / Files
      </div>
      {/* <div
                className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "retrieve"
                    ? "bg-semantic-accent-bg text-semantic-accent-hover"
                    : selectedKnowledgeBase
                        ? "text-semantic-fg-secondary cursor-pointer"
                        : "text-semantic-fg-secondary cursor-not-allowed opacity-50"
                    }`}
                onClick={() => selectedKnowledgeBase && onTabChange("retrieve")}
            >
                Retrieve Test
            </div> */}
    </aside>
  );
};
