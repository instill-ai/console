import { GeneralAppPageProp } from "../../lib";
import { Sidebar } from "./components/Sidebar";
import { KnowledgeBaseTab } from "./components/KnowledgeBaseTab";
import { UploadExploreTab } from "./components/UploadExploreTab";
import { CatalogFilesTab } from "./components/CatalogFilesTab";
import { MarkdownTab } from "./components/MarkdownTab";
import * as React from "react";
import { KnowledgeBase } from "../../lib/vdp-sdk/knowledge/types";
import { Button, Icons, LinkButton } from "@instill-ai/design-system";
import { DELETE_KNOWLEDGE_BASE_TIMEOUT } from "./components/undoDeleteTime";
import { ChunkTab } from "./components/ChunkTab";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

export const KnowledgeBaseView = (props: KnowledgeBaseViewProps) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    React.useState<KnowledgeBase | null>(null);
  const [activeTab, setActiveTab] = React.useState("knowledge-base");
  const [selectedTextOption, setSelectedTextOption] = React.useState("");
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] =
    React.useState<KnowledgeBase | null>(null);

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTextOptionChange = (option: string) => {
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

  const handleUndoDelete = () => {
    setIsDeleted(false);
    setShowDeleteMessage(false);
    setKnowledgeBaseToDelete(null);
  };

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/
  return (
    <div className="h-screen w-full bg-semantic-bg-primary">
      {showDeleteMessage && knowledgeBaseToDelete ? (
        <div className="fixed bottom-4 right-4 mr-4 flex h-[136px] w-[400px] rounded-lg border border-slate-200 bg-semantic-bg-primary p-4 shadow">
          <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
          <div className="h-[104px] shrink grow basis-0 flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justify-start gap-1 self-stretch">
              <div className="self-stretch product-body-text-2-semibold">
                {knowledgeBaseToDelete.name} has been deleted
              </div>
              <div className="self-stretch product-body-text-2-regular">
                If this was a mistake, click &quot;Undo Action&quot; to reapply
                your changes.
              </div>
            </div>
            <LinkButton
              className=""
              variant="secondary"
              size="md"
              onClick={handleUndoDelete}
            >
              Undo Action
            </LinkButton>
          </div>
          <Button
            className="absolute right-2 top-2"
            variant="tertiaryGrey"
            size="sm"
            onClick={() => setShowDeleteMessage(false)}
          >
            <Icons.X className="h-4 w-4 stroke-semantic-fg-secondary" />
          </Button>
        </div>
      ) : null}
      <div className="grid w-full grid-cols-12 gap-6 pl-4 pr-8 pt-6">
        <div className="pr-8 pt-20 sm:col-span-4 md:col-span-3 lg:col-span-2">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedKnowledgeBase={selectedKnowledgeBase}
            selectedTextOption={selectedTextOption}
            onTextOptionChange={handleTextOptionChange}
          />
        </div>
        <div className="sm:col-span-8 md:col-span-9 lg:col-span-10">
          {activeTab === "knowledge-base" ? (
            <KnowledgeBaseTab
              onKnowledgeBaseSelect={handleKnowledgeBaseSelect}
              onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
              accessToken={props.accessToken}
            />
          ) : null}
          {activeTab === "upload" && selectedKnowledgeBase ? (
            <UploadExploreTab knowledgeBase={selectedKnowledgeBase} />
          ) : null}
          {activeTab === "catalog" && selectedKnowledgeBase ? (
            <>
              {!selectedTextOption ? (
                <CatalogFilesTab knowledgeBase={selectedKnowledgeBase} />
              ) : null}
              {selectedTextOption === "Markdown" ? (
                <MarkdownTab knowledgeBase={selectedKnowledgeBase} />
              ) : null}
              {selectedTextOption === "Chunk" ? (
                <ChunkTab knowledgeBase={selectedKnowledgeBase} />
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};