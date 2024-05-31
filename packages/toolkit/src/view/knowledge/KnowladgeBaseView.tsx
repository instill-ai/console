// KnowledgeBaseView.tsx
import { GeneralAppPageProp } from "../../lib";
import { Sidebar } from "./components/Sidebar";
import { KnowledgeBaseTab } from "./components/KnowledgeBaseTab";
import { UploadExploreTab } from "./components/UploadExploreTab";
import { CatalogFilesTab } from "./components/CatalogFilesTab";
import { RetrieveTestTab } from "./components/RetrieveTestTab";
import * as React from "react";
import { KnowledgeBase } from "../../lib/vdp-sdk/knowledge/types";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

export const KnowledgeBaseView = (props: KnowledgeBaseViewProps) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = React.useState<KnowledgeBase | null>(null);
  const [activeTab, setActiveTab] = React.useState("knowledge-base");

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/


  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleKnowledgeBaseSelect = (knowledgeBase: KnowledgeBase) => {
    setSelectedKnowledgeBase(knowledgeBase);
    handleTabChange("upload");
  };

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/
  return (
    <div className="w-full h-screen bg-semantic-bg-primary">
      <div className="grid w-full grid-cols-12 gap-6 pl-4 pr-8 pt-6">
        <div className="lg:col-span-2 md:col-span-3 sm:col-span-4 pt-20 pr-8">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedKnowledgeBase={selectedKnowledgeBase}
          />
        </div>
        <div className="lg:col-span-10 md:col-span-9 sm:col-span-8">
          {activeTab === "knowledge-base" && (
            <KnowledgeBaseTab onKnowledgeBaseSelect={handleKnowledgeBaseSelect} />
          )}
          {activeTab === "upload" && selectedKnowledgeBase && (
            <UploadExploreTab knowledgeBase={selectedKnowledgeBase} />
          )}
          {activeTab === "catalog" && selectedKnowledgeBase && (
            <CatalogFilesTab knowledgeBase={selectedKnowledgeBase} />
          )}
          {activeTab === "retrieve" && selectedKnowledgeBase && <RetrieveTestTab />}
        </div>
      </div>
    </div>
  );
};