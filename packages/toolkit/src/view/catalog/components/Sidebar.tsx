"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Icons } from "@instill-ai/design-system";

import { Catalog } from "../../../lib/react-query-service/catalog/types";

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedCatalog: Catalog | null;
  onDeselectCatalog: () => void;
};

export const Sidebar = ({
  activeTab,
  onTabChange,
  selectedCatalog,
  onDeselectCatalog,
}: SidebarProps) => {
  const router = useRouter();
  const [isApiExpanded, setIsApiExpanded] = React.useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === "catalogs") {
      onDeselectCatalog();
    }
    onTabChange(tab);
    router.push(`#${tab}`, { scroll: false });
  };

  const getTabClassName = (tabName: string) => {
    const baseClass =
      "flex h-8 items-center gap-x-2 rounded px-3 product-button-button-2";
    const isActive = activeTab === tabName;
    if (isActive) {
      return `${baseClass} bg-semantic-accent-bg text-semantic-accent-hover font-bold`;
    } else {
      return `${baseClass} cursor-pointer text-semantic-fg-secondary`;
    }
  };

  const isApiTabActive = ["retrieve", "ask_question", "get_catalog"].includes(
    activeTab,
  );

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
        className={`${getTabClassName("catalogs")} whitespace-nowrap`}
        onClick={() => handleTabChange("catalogs")}
      >
        {selectedCatalog && activeTab !== "catalogs" && (
          <Icons.ArrowLeft className="h-4 w-4 stroke-semantic-fg-disabled" />
        )}
        My Catalogs
      </div>
      {selectedCatalog && (
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
            className={`${getTabClassName("api")} ${
              isApiExpanded ? "bg-semantic-accent-bg" : ""
            }`}
            onClick={handleApiClick}
          >
            <Icons.ChevronDown
              className={`h-4 w-4 transition-transform duration-200 stroke-semantic-fg-secondary ${
                isApiExpanded ? "transform rotate-180" : ""
              }`}
            />
            API
          </div>
          {isApiExpanded && (
            <>
              <div
                className={`${getTabClassName("retrieve")} ml-4`}
                onClick={() => handleTabChange("retrieve")}
              >
                Retrieve Chunk
              </div>
              <div
                className={`${getTabClassName("ask_question")} ml-4`}
                onClick={() => handleTabChange("ask_question")}
              >
                Ask Question
              </div>
              <div
                className={`${getTabClassName("get_catalog")} ml-4`}
                onClick={() => handleTabChange("get_catalog")}
              >
                Get Catalog
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
};
