"use client";
import { useRouter } from "next/navigation";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { Icons } from "@instill-ai/design-system";
// import { DropdownMenu } from "@instill-ai/design-system";

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

  return (
    <aside className="flex w-[160px] flex-col gap-y-4">
      <div
        className={`flex h-8 items-center gap-x-2 whitespace-nowrap rounded px-3 product-button-button-2 ${activeTab === "knowledge-base"
          ? "bg-semantic-accent-bg text-semantic-accent-hover"
          : "cursor-pointer text-semantic-fg-secondary"
          }`}
        onClick={() => handleTabChange("knowledge-base")}
      >
        My Knowledge Bases
      </div>
      <div
        className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "upload"
          ? "bg-semantic-accent-bg text-semantic-accent-hover"
          : selectedKnowledgeBase
            ? "cursor-pointer text-semantic-fg-secondary"
            : "cursor-not-allowed text-semantic-fg-secondary "
          }`}
        onClick={() => selectedKnowledgeBase && handleTabChange("upload")}
      >
        Upload & Explore
      </div>
      <div
        className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "catalog"
          ? "bg-semantic-accent-bg text-semantic-accent-hover"
          : selectedKnowledgeBase
            ? "cursor-pointer text-semantic-fg-secondary"
            : "cursor-not-allowed text-semantic-fg-secondary "
          }`}
        onClick={() => {
          selectedKnowledgeBase && handleTabChange("catalog");
          onTextOptionChange(null);
        }}
      >
        <Icons.ChevronRight className="w-4 h-4 stroke-black" />
        Catalog
      </div>
      {activeTab === "catalog" && (
        <>
          <div className="ml-4">
            <div
              className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedTextOption === "Markdown"
                ? "bg-semantic-accent-bg text-semantic-accent-hover"
                : "cursor-pointer text-semantic-fg-secondary"
                }`}
              onClick={() => {
                selectedKnowledgeBase && handleTabChange("catalog");
                onTextOptionChange("catalog");
              }}            >
              Files
            </div>
            <div
              className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedTextOption === "Chunk"
                ? "bg-semantic-accent-bg text-semantic-accent-hover"
                : "cursor-pointer text-semantic-fg-secondary"
                }`}
              onClick={() => onTextOptionChange("Chunk")}
            >
              Chunk
            </div>
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
        className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "retrieve"
          ? "bg-semantic-accent-bg text-semantic-accent-hover"
          : selectedKnowledgeBase
            ? "cursor-pointer text-semantic-fg-secondary"
            : "cursor-not-allowed text-semantic-fg-secondary "
          }`}
        onClick={() => handleTabChange("retrieve")}
      >
        Retrieve Test
      </div>
    </aside>
  );
};
