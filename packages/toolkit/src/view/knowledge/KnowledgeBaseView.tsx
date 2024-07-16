import { GeneralAppPageProp } from "../../lib";
import { Sidebar } from "./components/Sidebar";
import { KnowledgeBaseTab } from "./components/KnowledgeBaseTab";
import { UploadExploreTab } from "./components/UploadExploreTab";
import { CatalogFilesTab } from "./components/CatalogFilesTab";
import { MarkdownTab } from "./components/MarkdownTab";
import * as React from "react";
import { KnowledgeBase } from "../../lib/vdp-sdk/knowledge/types";
// import { Button, Icons, LinkButton } from "@instill-ai/design-system";
import { DELETE_KNOWLEDGE_BASE_TIMEOUT, CREDIT_TIMEOUT } from "./components/undoDeleteTime";
import { ChunkTab } from "./components/ChunkTab";
import { ImageTab } from "./components/ImageTab";
import { Nullable } from "@instill-ai/toolkit";
import { RetrieveTestTab } from "./components/RetrieveTestTab";
import CreditUsageNotification from "./components/Notifications/CreditUsageFileNotification";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

export const KnowledgeBaseView = (props: KnowledgeBaseViewProps) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    React.useState<KnowledgeBase | null>(null);
  const [activeTab, setActiveTab] = React.useState("knowledge-base");
  const [selectedTextOption, setSelectedTextOption] = React.useState(
    null as Nullable<string>
  );
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] =
    React.useState<KnowledgeBase | null>(null);
  const [showCreditUsage, setShowCreditUsage] = React.useState(false);



  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTextOptionChange = (option: string | null) => {
    setSelectedTextOption(option);
  };

  const handleKnowledgeBaseSelect = (knowledgeBase: KnowledgeBase) => {
    setSelectedKnowledgeBase(knowledgeBase);
    handleTabChange("upload");
  };

  const handleDeleteKnowledgeBase = (knowledgeBase: KnowledgeBase) => {
    setKnowledgeBaseToDelete(knowledgeBase);
    setIsDeleted(true);
    setShowDeleteMessage(true);
    setTimeout(() => {
      if (isDeleted && knowledgeBaseToDelete) {
        setShowDeleteMessage(false);
        setKnowledgeBaseToDelete(null);
        setIsDeleted(false);
      }
    }, DELETE_KNOWLEDGE_BASE_TIMEOUT);
  };

  const handleProcessFile = () => {
    setActiveTab("catalog");
    setShowCreditUsage(true);
    setTimeout(() => {
      setShowCreditUsage(false);
    }, CREDIT_TIMEOUT);
  };

  // const handleUndoDelete = () => {
  //   setIsDeleted(false);
  //   setShowDeleteMessage(false);
  //   setKnowledgeBaseToDelete(null);
  // };

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/
  return (
    <div className="h-screen w-full bg-semantic-bg-alt-primary">
      {showDeleteMessage && knowledgeBaseToDelete ? (
        // <DeleteKnowledgeBaseNotification
        //   knowledgeBaseName={knowledgeBase.name}
        //   handleCloseDeleteMessage={handleCloseDeleteMessage}
        //   undoDelete={undoDelete}
        // />
        <></>
      ) : null}
      {showCreditUsage && (
        <CreditUsageNotification
          handleCloseUnsupportedFileMessage={() => setShowCreditUsage(false)}
        />
      )}
      <div className="grid w-full grid-cols-12 gap-6 px-8">
        <div className="pt-20 sm:col-span-4 md:col-span-3 lg:col-span-2">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedKnowledgeBase={selectedKnowledgeBase}
            selectedTextOption={selectedTextOption}
            onTextOptionChange={handleTextOptionChange}
          />
        </div>
        <div
          className={`sm:col-span-8 md:col-span-9 lg:col-span-10 ${activeTab === "catalog" ? "pt-5" : "pt-6"}`}
        >
          {activeTab === "knowledge-base" ? (
            <KnowledgeBaseTab
              onKnowledgeBaseSelect={handleKnowledgeBaseSelect}
              onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
              accessToken={props.accessToken}
            />
          ) : null}
          {activeTab === "upload" && selectedKnowledgeBase ? (
            <UploadExploreTab
              knowledgeBase={selectedKnowledgeBase}
              onProcessFile={handleProcessFile}
            />
          ) : null}
          {activeTab === "catalog" && selectedKnowledgeBase ? (
            <>
              {selectedTextOption === "Markdown" ? (
                <MarkdownTab knowledgeBase={selectedKnowledgeBase} />
              ) : null}
              {selectedTextOption === "Chunk" ? (
                <ChunkTab knowledgeBase={selectedKnowledgeBase} />
              ) : null}
              {selectedTextOption === "Image" ? (
                <ImageTab knowledgeBase={selectedKnowledgeBase} />
              ) : null}
              {!selectedTextOption || selectedTextOption === "Files" ? (
                <CatalogFilesTab knowledgeBase={selectedKnowledgeBase} />
              ) : null}
            </>
          ) : null}
          {activeTab === "retrieve" && selectedKnowledgeBase ? (
            <RetrieveTestTab knowledgeBase={selectedKnowledgeBase} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
