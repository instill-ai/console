'use client';
import { useRouter } from 'next/navigation';
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { DropdownMenu } from "@instill-ai/design-system";

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
        className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "knowledge-base"
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
            : "cursor-not-allowed text-semantic-fg-secondary opacity-50"
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
            : "cursor-not-allowed text-semantic-fg-secondary opacity-50"
          }`}
        onClick={() => {
          selectedKnowledgeBase && handleTabChange("catalog");
          onTextOptionChange(null);
        }}
      >
        Catalog / Files
      </div>
      {/* 
      {activeTab === "catalog" && (
        <>
          <div
            className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedTextOption === "Markdown" || selectedTextOption === "Chunk"
              ? "bg-semantic-accent-bg text-semantic-accent-hover"
              : "cursor-pointer text-semantic-fg-secondary"
              }`}
          >
            Text
            <div className="ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <div
              className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedTextOption === "Markdown"
                ? "bg-semantic-accent-bg text-semantic-accent-hover"
                : "cursor-pointer text-semantic-fg-secondary"
                }`}
              onClick={() => onTextOptionChange("Markdown")}
            >
              Markdown
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
          <div
            className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${selectedTextOption === "Image"
              ? "bg-semantic-accent-bg text-semantic-accent-hover"
              : "cursor-pointer text-semantic-fg-secondary"
              }`}
            onClick={() => onTextOptionChange("Image")}
          >
            Image
          </div>
        </>
      )}
      <div
        className={`flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2 ${activeTab === "retrieve"
          ? "bg-semantic-accent-bg text-semantic-accent-hover"
          : selectedKnowledgeBase
            ? "cursor-pointer text-semantic-fg-secondary"
            : "cursor-not-allowed text-semantic-fg-secondary opacity-50"
          }`}
        onClick={() => handleTabChange("retrieve")}

      >
        Retrieve Test
      </div> */}
    </aside>
  );
};