import * as React from "react";
import { Nullable } from "instill-sdk";

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
import { CREDIT_TIMEOUT } from "./components/lib/static";
import { CreditUsageFileNotification } from "./components/notifications";
import {
  CatalogFilesTab,
  ChunkTab,
  KnowledgeBaseTab,
  RetrieveTestTab,
  UploadExploreTab,
} from "./components/tabs";
import { WarnDiscardFilesDialog } from "./components";
import { useAuthenticatedUserSubscription } from "../../lib";
import { getPlanStorageLimit } from "./components/lib/helpers";

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
  const [isProcessed, setIsProcessed] = React.useState(false);
  const [showCreditUsage, setShowCreditUsage] = React.useState(false);
  const [creditUsageTimer, setCreditUsageTimer] =
    React.useState<NodeJS.Timeout | null>(null);
  const [showWarnDialog, setShowWarnDialog] = React.useState(false);
  const [pendingTabChange, setPendingTabChange] = React.useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [remainingStorageSpace, setRemainingStorageSpace] = React.useState(0);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector)
  );
  const isLocalEnvironment = env("NEXT_PUBLIC_APP_ENV") === "CE";

  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const { data: knowledgeBases, refetch: refetchKnowledgeBases } = useGetKnowledgeBases({
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

  const sub = useAuthenticatedUserSubscription({
    enabled: enabledQuery,
    accessToken,
  });

  const planStorageLimit = getPlanStorageLimit(sub.data?.plan || "PLAN_FREEMIUM");

  React.useEffect(() => {
    if (knowledgeBases) {
      const totalUsed = knowledgeBases.reduce((total, kb) => total + parseInt(String(kb.usedStorage)), 0);
      setRemainingStorageSpace(planStorageLimit - totalUsed);
    }
  }, [knowledgeBases, planStorageLimit]);

  const updateRemainingSpace = (fileSize: number, isAdding: boolean) => {
    setRemainingStorageSpace(prev => isAdding ? prev - fileSize : prev + fileSize);
  };

  React.useEffect(() => {
    if (filesData) {
      const hasChunks = filesData.files.some((file) => file.totalChunks > 0);
      setIsProcessed(hasChunks);
    }
  }, [filesData]);

  const handleTabChangeAttempt = (tab: string) => {
    if (hasUnsavedChanges) {
      setShowWarnDialog(true);
      setPendingTabChange(tab);
    } else {
      setActiveTab(tab);
    }
  };

  const handleWarnDialogClose = async (): Promise<void> => {
    return new Promise((resolve) => {
      setShowWarnDialog(false);
      setPendingTabChange(null);
      resolve();
    });
  };

  const handleWarnDialogDiscard = () => {
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
    }
    setShowWarnDialog(false);
    setPendingTabChange(null);
    setHasUnsavedChanges(false);
  };

  const handleProcessFile = () => {
    setShowCreditUsage(true);
    setActiveTab("files");
    setIsProcessed(false);
    setHasUnsavedChanges(false);

    const timer = setTimeout(() => {
      setShowCreditUsage(false);
    }, CREDIT_TIMEOUT);

    setCreditUsageTimer(timer);
  };

  const handleKnowledgeBaseSelect = (knowledgeBase: KnowledgeBase) => {
    setSelectedKnowledgeBase(knowledgeBase);
    setActiveTab("upload");
    setHasUnsavedChanges(false);
  };

  const handleDeleteKnowledgeBase = async (knowledgeBase: KnowledgeBase) => {
    if (!selectedNamespace || !accessToken) return;

    try {
      await deleteKnowledgeBase.mutateAsync({
        ownerId: selectedNamespace,
        kbId: knowledgeBase.catalogId,
        accessToken,
      });
      if (selectedKnowledgeBase?.catalogId === knowledgeBase.catalogId) {
        setSelectedKnowledgeBase(null);
        setActiveTab("catalogs");
      }
      refetchKnowledgeBases();
    } catch (error) {
      console.error("Error deleting catalog:", error);
    }
  };

  const handleCloseCreditUsageMessage = () => {
    setShowCreditUsage(false);
    if (creditUsageTimer) {
      clearTimeout(creditUsageTimer);
      setCreditUsageTimer(null);
    }
  };

  const handleGoToUpload = () => {
    handleTabChangeAttempt("upload");
  };

  const handleDeselectKnowledgeBase = () => {
    setSelectedKnowledgeBase(null);
    setActiveTab("catalogs");
    setHasUnsavedChanges(false);
  };

  React.useEffect(() => {
    setSelectedKnowledgeBase(null);
    setActiveTab("catalogs");
    setHasUnsavedChanges(false);
  }, [selectedNamespace]);

  React.useEffect(() => {
    return () => {
      if (creditUsageTimer) {
        clearTimeout(creditUsageTimer);
      }
    };
  }, [creditUsageTimer]);

  return (
    <div className="h-screen w-full bg-semantic-bg-alt-primary">
      {showCreditUsage && !isLocalEnvironment && (
        <CreditUsageFileNotification
          handleCloseCreditUsageMessage={handleCloseCreditUsageMessage}
          fileName="test"
        />
      )}
      <div className="grid w-full grid-cols-12 gap-6 px-8">
        {selectedKnowledgeBase && (
          <div className="pt-20 sm:col-span-4 md:col-span-3 lg:col-span-2">
            <Sidebar
              activeTab={activeTab}
              onTabChange={handleTabChangeAttempt}
              selectedKnowledgeBase={selectedKnowledgeBase}
              onDeselectKnowledgeBase={handleDeselectKnowledgeBase}
            />
          </div>
        )}
        <div className={`${selectedKnowledgeBase ? 'sm:col-span-8 md:col-span-9 lg:col-span-10' : 'col-span-12'} pt-5`}>
          {activeTab === "catalogs" && (
            <KnowledgeBaseTab
              onKnowledgeBaseSelect={handleKnowledgeBaseSelect}
              onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
              accessToken={props.accessToken}
              knowledgeBases={knowledgeBases || []}
            />
          )}
          {activeTab === "upload" && selectedKnowledgeBase && (
            <UploadExploreTab
              knowledgeBase={selectedKnowledgeBase}
              onProcessFile={handleProcessFile}
              onTabChange={setActiveTab}
              setHasUnsavedChanges={setHasUnsavedChanges}
              remainingStorageSpace={remainingStorageSpace}
              updateRemainingSpace={updateRemainingSpace}
            />
          )}
          {activeTab === "files" && selectedKnowledgeBase && (
            <CatalogFilesTab
              knowledgeBase={selectedKnowledgeBase}
              onGoToUpload={handleGoToUpload}
              remainingStorageSpace={remainingStorageSpace}
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
      <WarnDiscardFilesDialog
        open={showWarnDialog}
        setOpen={setShowWarnDialog}
        onCancel={handleWarnDialogClose}
        onDiscard={handleWarnDialogDiscard}
      />
    </div>
  );
};