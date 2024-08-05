import * as React from "react";

import { Nullable } from "@instill-ai/toolkit";

import {
  GeneralAppPageProp,
  InstillStore,
  useInstillStore,
  useShallow,
} from "../../lib";
import {
  useDeleteKnowledgeBase,
  useGetKnowledgeBases,
  useListKnowledgeBaseFiles,
} from "../../lib/react-query-service/knowledge";
import { KnowledgeBase } from "../../lib/react-query-service/knowledge/types";
import { env } from "../../server";
import { Sidebar } from "./components";
import {
  CREDIT_TIMEOUT,
  DELETE_KNOWLEDGE_BASE_TIMEOUT,
} from "./components/lib/static";
import {
  CreditUsageFileNotification,
  DeleteKnowledgeBaseNotification,
} from "./components/notifications";
import {
  CatalogFilesTab,
  ChunkTab,
  KnowledgeBaseTab,
  RetrieveTestTab,
  UploadExploreTab,
} from "./components/tabs";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const KnowledgeBaseView = (props: KnowledgeBaseViewProps) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    React.useState<Nullable<KnowledgeBase>>(null);
  const [activeTab, setActiveTab] = React.useState("catalogs");
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] =
    React.useState<Nullable<KnowledgeBase>>(null);
  const [isProcessed, setIsProcessed] = React.useState(false);
  const [pendingDeletions, setPendingDeletions] = React.useState<string[]>([]);
  const [deletionTimer, setDeletionTimer] =
    React.useState<NodeJS.Timeout | null>(null);
  const [showCreditUsage, setShowCreditUsage] = React.useState(false);
  const [creditUsageTimer, setCreditUsageTimer] =
    React.useState<NodeJS.Timeout | null>(null);
  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );
  const isLocalEnvironment = env("NEXT_PUBLIC_APP_ENV") === "CE";

  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const { refetch: refetchKnowledgeBases } = useGetKnowledgeBases({
    accessToken,
    ownerId: selectedNamespace ?? null,
    enabled: enabledQuery && !!selectedNamespace,
  });

  const { data: filesData } = useListKnowledgeBaseFiles({
    namespaceId: selectedNamespace ?? null,
    knowledgeBaseId: selectedKnowledgeBase?.catalogId ?? "",
    accessToken,
    enabled:
      enabledQuery &&
      Boolean(selectedNamespace) &&
      Boolean(selectedKnowledgeBase),
  });

  React.useEffect(() => {
    if (filesData) {
      const hasChunks = filesData.some((file) => file.totalChunks > 0);
      setIsProcessed(hasChunks);
    }
  }, [filesData]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleKnowledgeBaseSelect = (knowledgeBase: KnowledgeBase) => {
    setSelectedKnowledgeBase(knowledgeBase);
    handleTabChange("upload");
  };

  const handleDeleteKnowledgeBase = (knowledgeBase: KnowledgeBase) => {
    setKnowledgeBaseToDelete(knowledgeBase);
    setShowDeleteMessage(true);
    setPendingDeletions((prev) => [...prev, knowledgeBase.catalogId]);

    const timer = setTimeout(() => {
      actuallyDeleteKnowledgeBase();
    }, DELETE_KNOWLEDGE_BASE_TIMEOUT);

    setDeletionTimer(timer);
  };

  const actuallyDeleteKnowledgeBase = async () => {
    if (!selectedNamespace || !accessToken || !knowledgeBaseToDelete) return;

    try {
      await deleteKnowledgeBase.mutateAsync({
        ownerId: selectedNamespace,
        kbId: knowledgeBaseToDelete.catalogId,
        accessToken,
      });
      if (
        selectedKnowledgeBase?.catalogId === knowledgeBaseToDelete.catalogId
      ) {
        setSelectedKnowledgeBase(null);
        setActiveTab("catalogs");
      }
      refetchKnowledgeBases();
    } catch (error) {
      console.error("Error deleting catalog:", error);
    } finally {
      cleanupDeleteState();
    }
  };

  const cleanupDeleteState = () => {
    setShowDeleteMessage(false);
    setKnowledgeBaseToDelete(null);
    setPendingDeletions((prev) =>
      prev.filter((id) => id !== knowledgeBaseToDelete?.catalogId),
    );
    if (deletionTimer) {
      clearTimeout(deletionTimer);
      setDeletionTimer(null);
    }
  };

  const undoDelete = () => {
    cleanupDeleteState();
  };

  const handleCloseDeleteMessage = () => {
    actuallyDeleteKnowledgeBase();
  };

  const handleProcessFile = () => {
    setShowCreditUsage(true);
    setActiveTab("catalogs");
    setIsProcessed(false);

    const timer = setTimeout(() => {
      setShowCreditUsage(false);
    }, CREDIT_TIMEOUT);

    setCreditUsageTimer(timer);
  };

  const handleCloseCreditUsageMessage = () => {
    setShowCreditUsage(false);
    if (creditUsageTimer) {
      clearTimeout(creditUsageTimer);
      setCreditUsageTimer(null);
    }
  };

  const handleGoToUpload = () => {
    handleTabChange("upload");
  };

  const handleDeselectKnowledgeBase = () => {
    setSelectedKnowledgeBase(null);
    setActiveTab("catalogs");
  };

  React.useEffect(() => {
    setSelectedKnowledgeBase(null);
    setActiveTab("catalogs");
  }, [selectedNamespace]);

  React.useEffect(() => {
    if (showDeleteMessage) {
      const timer = setTimeout(() => {
        actuallyDeleteKnowledgeBase();
      }, DELETE_KNOWLEDGE_BASE_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [showDeleteMessage, actuallyDeleteKnowledgeBase]);

  // Cleanup effect for credit usage timer
  React.useEffect(() => {
    return () => {
      if (creditUsageTimer) {
        clearTimeout(creditUsageTimer);
      }
    };
  }, [creditUsageTimer]);

  return (
    <div className="h-screen w-full bg-semantic-bg-alt-primary">
      {showDeleteMessage && knowledgeBaseToDelete && (
        <DeleteKnowledgeBaseNotification
          knowledgeBaseName={knowledgeBaseToDelete.name}
          handleCloseDeleteMessage={handleCloseDeleteMessage}
          undoDelete={undoDelete}
        />
      )}
      {showCreditUsage && !isLocalEnvironment && (
        <CreditUsageFileNotification
          handleCloseCreditUsageMessage={handleCloseCreditUsageMessage}
          fileName="test"
        />
      )}
      <div className="grid w-full grid-cols-12 gap-6 px-8">
        <div className="pt-20 sm:col-span-4 md:col-span-3 lg:col-span-2">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedKnowledgeBase={selectedKnowledgeBase}
            onDeselectKnowledgeBase={handleDeselectKnowledgeBase}
          />
        </div>
        <div className={`sm:col-span-8 md:col-span-9 lg:col-span-10 pt-5`}>
          {activeTab === "catalogs" && (
            <KnowledgeBaseTab
              onKnowledgeBaseSelect={handleKnowledgeBaseSelect}
              onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
              accessToken={props.accessToken}
              pendingDeletions={pendingDeletions}
            />
          )}
          {activeTab === "upload" && selectedKnowledgeBase && (
            <UploadExploreTab
              knowledgeBase={selectedKnowledgeBase}
              onProcessFile={handleProcessFile}
              onTabChange={handleTabChange}
            />
          )}
          {activeTab === "files" && selectedKnowledgeBase && (
            <CatalogFilesTab
              knowledgeBase={selectedKnowledgeBase}
              onGoToUpload={handleGoToUpload}
            />
          )}
          {activeTab === "chunks" && selectedKnowledgeBase && (
            <ChunkTab
              knowledgeBase={selectedKnowledgeBase}
              onGoToUpload={handleGoToUpload}
            />
          )}
          {activeTab === "retrieve" && selectedKnowledgeBase && (
            <RetrieveTestTab
              knowledgeBase={selectedKnowledgeBase}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
              namespaceId={selectedNamespace}
            />
          )}
        </div>
      </div>
    </div>
  );
};
