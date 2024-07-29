import * as React from "react";

import { Nullable } from "@instill-ai/toolkit";

import { GeneralAppPageProp } from "../../lib";
import { KnowledgeBase } from "../../lib/vdp-sdk/knowledge/types";
import { CatalogFilesTab } from "./components/CatalogFilesTab";
import { ChunkTab } from "./components/ChunkTab";
import { ImageTab } from "./components/ImageTab";
import { KnowledgeBaseTab } from "./components/KnowledgeBaseTab";
import { MarkdownTab } from "./components/MarkdownTab";
import CreditUsageNotification from "./components/Notifications/CreditUsageFileNotification";
import { RetrieveTestTab } from "./components/RetrieveTestTab";
import { Sidebar } from "./components/Sidebar";
// import { Button, Icons, LinkButton } from "@instill-ai/design-system";
import {
  CREDIT_TIMEOUT,
  DELETE_KNOWLEDGE_BASE_TIMEOUT,
} from "./components/undoDeleteTime";
import { UploadExploreTab } from "./components/UploadExploreTab";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

export const KnowledgeBaseView = (props: KnowledgeBaseViewProps) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    React.useState<Nullable<KnowledgeBase>>(null);
  const [activeTab, setActiveTab] = React.useState("knowledge-base");
  const [selectedTextOption, setSelectedTextOption] = React.useState(
    null as Nullable<string>,
  );
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] =
    React.useState<Nullable<KnowledgeBase>>(null);
  const [showCreditUsage, setShowCreditUsage] = React.useState(false);

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTextOptionChange = (option: Nullable<string>) => {
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
          handleCloseCreditUsageMessage={() => setShowCreditUsage(false)}
          fileName="test"
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
          className={`sm:col-span-8 md:col-span-9 lg:col-span-10 pt-5`}
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
            <RetrieveTestTab
              knowledgeBase={selectedKnowledgeBase}
              isProcessed={false}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
