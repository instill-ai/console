// KnowledgeBaseView.tsx
import { GeneralAppPageProp } from "../../lib";
import { Sidebar } from "./components/Sidebar";
import { KnowledgeBaseTab } from "./components/KnowledgeBaseTab";
import { UploadExploreTab } from "./components/UploadExploreTab";
import { CatalogFilesTab } from "./components/CatalogFilesTab";
import { RetrieveTestTab } from "./components/RetrieveTestTab";
import * as React from "react";
import { KnowledgeBase } from "../../lib/vdp-sdk/knowledge/types";
import { Button, Icons, LinkButton } from "@instill-ai/design-system";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

export const KnowledgeBaseView = (props: KnowledgeBaseViewProps) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = React.useState<KnowledgeBase | null>(null);
  const [activeTab, setActiveTab] = React.useState("knowledge-base");
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] = React.useState<KnowledgeBase | null>(null);


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
  React.useEffect(() => {
    if (showDeleteMessage) {
      const timer = setTimeout(() => {
        if (isDeleted && knowledgeBaseToDelete) {
          setShowDeleteMessage(false);
          setKnowledgeBaseToDelete(null);
          setIsDeleted(false);
          // Perform the deletion here or pass this state up to parent component to handle
        }
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [showDeleteMessage, isDeleted, knowledgeBaseToDelete]);
  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/
  return (
    <div className="w-full h-screen bg-semantic-bg-primary">
      {showDeleteMessage && (
        <div className="fixed bottom-4 right-4 w-[400px] h-[136px] p-4 bg-semantic-bg-primary rounded-lg shadow border border-slate-200 flex mr-4">
          <Icons.AlertTriangle className="w-6 h-6 stroke-semantic-warning-on-bg" />
          <div className="grow shrink basis-0 h-[104px] flex-col justify-start items-start gap-4">
            <div className="self-stretch flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch product-body-text-2-semibold">This Knowledge base has been deleted</div>
              <div className="self-stretch product-body-text-2-regular">If this was a mistake, click "Undo Action" to reapply your changes.</div>
            </div>
            <LinkButton
              className=""
              variant="secondary"
              size="md"
              onClick={() => {
                setShowDeleteMessage(false);
                setIsDeleted(false);
              }}
            >
              Undo Action
            </LinkButton>
          </div>
          <Button
            className="absolute top-2 right-2"
            variant="tertiaryGrey"
            size="sm"
            onClick={() => setShowDeleteMessage(false)}
          >
            <Icons.X className="w-4 h-4 stroke-semantic-fg-secondary" />
          </Button>
        </div>
      )}
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