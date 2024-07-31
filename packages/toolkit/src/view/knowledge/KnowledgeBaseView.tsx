import * as React from "react";

import { Nullable } from "@instill-ai/toolkit";

import {
  GeneralAppPageProp,
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../lib";
import {
  useDeleteKnowledgeBase,
  useGetKnowledgeBases,
  useListKnowledgeBaseFiles,
} from "../../lib/react-query-service/knowledge";
import { KnowledgeBase } from "../../../../sdk/src/knowledge/types";
import { DeleteKnowledgeBaseNotification, CreditUsageFileNotification } from "./components/notifications";
import { Sidebar } from "./components";
import { CatalogFilesTab, ChunkTab, ImageTab, KnowledgeBaseTab, MarkdownTab, RetrieveTestTab, UploadExploreTab } from "./components/tabs";
import {
  CREDIT_TIMEOUT,
  DELETE_KNOWLEDGE_BASE_TIMEOUT,
} from "./components/lib/undoDeleteTime";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

export const KnowledgeBaseView = (props: KnowledgeBaseViewProps) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    React.useState<Nullable<KnowledgeBase>>(null);
  const [activeTab, setActiveTab] = React.useState("knowledge-base");
  const [selectedTextOption, setSelectedTextOption] = React.useState(
    null as Nullable<string>,
  );
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] =
    React.useState<Nullable<KnowledgeBase>>(null);
  const [showCreditUsage, setShowCreditUsage] = React.useState(false);
  const [isProcessed, setIsProcessed] = React.useState(false);
  const [pendingDeletions, setPendingDeletions] = React.useState<string[]>([]);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow((store: InstillStore) => ({
      accessToken: store.accessToken,
      enabledQuery: store.enabledQuery,
      selectedNamespace: store.navigationNamespaceAnchor,
    })),
  );

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const { refetch: refetchKnowledgeBases } = useGetKnowledgeBases({
    accessToken,
    ownerId: selectedNamespace ?? null,
    enabled: enabledQuery && !!selectedNamespace,
  });

  const { data: files } = useListKnowledgeBaseFiles({
    namespaceId: selectedNamespace ?? null,
    knowledgeBaseId: selectedKnowledgeBase?.kbId ?? "",
    accessToken,
    enabled:
      enabledQuery && Boolean(selectedNamespace) && Boolean(selectedKnowledgeBase),
  });

  React.useEffect(() => {
    if (files) {
      const hasChunks = files.some((file) => file.totalChunks > 0);
      setIsProcessed(hasChunks);
    }
  }, [files]);

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
    setShowDeleteMessage(true);
    setPendingDeletions((prev) => [...prev, knowledgeBase.kbId]);
  };

  const actuallyDeleteKnowledgeBase = async () => {
    if (!selectedNamespace || !accessToken || !knowledgeBaseToDelete) return;

    try {
      await deleteKnowledgeBase.mutateAsync({
        ownerId: selectedNamespace,
        kbId: knowledgeBaseToDelete.kbId,
        accessToken,
      });
      setShowDeleteMessage(false);
      setKnowledgeBaseToDelete(null);
      setPendingDeletions((prev) =>
        prev.filter((id) => id !== knowledgeBaseToDelete.kbId),
      );
      if (selectedKnowledgeBase?.kbId === knowledgeBaseToDelete.kbId) {
        setSelectedKnowledgeBase(null);
        setActiveTab("knowledge-base");
      }
      refetchKnowledgeBases();
    } catch (error) {
      console.error("Error deleting knowledge base:", error);
      setShowDeleteMessage(false);
    }
  };

  const undoDelete = () => {
    setShowDeleteMessage(false);
    if (knowledgeBaseToDelete) {
      setPendingDeletions((prev) =>
        prev.filter((id) => id !== knowledgeBaseToDelete.kbId),
      );
    }
    setKnowledgeBaseToDelete(null);
  };

  const handleProcessFile = () => {
    setActiveTab("catalog");
    setShowCreditUsage(true);
    setTimeout(() => {
      setShowCreditUsage(false);
    }, CREDIT_TIMEOUT);
  };

  const handleGoToUpload = () => {
    handleTabChange("upload");
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showDeleteMessage) {
      timer = setTimeout(() => {
        actuallyDeleteKnowledgeBase();
      }, DELETE_KNOWLEDGE_BASE_TIMEOUT);
    }
    return () => clearTimeout(timer);
  }, [showDeleteMessage]);

  React.useEffect(() => {
    // Reset selected knowledge base when namespace changes
    setSelectedKnowledgeBase(null);
    setActiveTab("knowledge-base");
  }, [selectedNamespace]);

  return (
    <div className="h-screen w-full bg-semantic-bg-alt-primary">
      {showDeleteMessage && knowledgeBaseToDelete && (
        <DeleteKnowledgeBaseNotification
          knowledgeBaseName={knowledgeBaseToDelete.name}
          handleCloseDeleteMessage={actuallyDeleteKnowledgeBase}
          undoDelete={undoDelete}
        />
      )}
      {showCreditUsage && (
        <CreditUsageFileNotification
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
        <div className={`sm:col-span-8 md:col-span-9 lg:col-span-10 pt-5`}>
          {activeTab === "knowledge-base" ? (
            <KnowledgeBaseTab
              onKnowledgeBaseSelect={handleKnowledgeBaseSelect}
              onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
              accessToken={props.accessToken}
              pendingDeletions={pendingDeletions}
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
                <ChunkTab
                  knowledgeBase={selectedKnowledgeBase}
                  onGoToUpload={handleGoToUpload}
                />
              ) : null}
              {selectedTextOption === "Image" ? (
                <ImageTab knowledgeBase={selectedKnowledgeBase} />
              ) : null}
              {!selectedTextOption || selectedTextOption === "Files" ? (
                <CatalogFilesTab
                  knowledgeBase={selectedKnowledgeBase}
                  onGoToUpload={handleGoToUpload}
                />
              ) : null}
            </>
          ) : null}
          {activeTab === "retrieve" && selectedKnowledgeBase ? (
            <RetrieveTestTab
              knowledgeBase={selectedKnowledgeBase}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};