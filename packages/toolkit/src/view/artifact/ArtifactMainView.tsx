"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KnowledgeBase, Nullable } from "instill-sdk";

import { cn } from "@instill-ai/design-system";

import type { KnowledgeBaseTabs } from "./types";
import {
  GeneralAppPageProp,
  InstillStore,
  toastInstillError,
  useDeleteNamespaceKnowledgeBase,
  useInstillStore,
  useListNamespaceFiles,
  useListNamespaceKnowledgeBases,
  useShallow,
} from "../../lib";
import { env } from "../../server";
import { Sidebar, WarnDiscardFilesDialog } from "./components";
import { CREDIT_TIMEOUT } from "./components/lib/constant";
import { CreditUsageFileNotification } from "./components/notifications";
import {
  ChunksTab,
  FilesTab,
  KnowledgeBaseMainTab,
  SearchChunksTab,
  UploadExploreTab,
} from "./components/tabs";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const KnowledgeBaseMainView = (props: KnowledgeBaseViewProps) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    React.useState<Nullable<KnowledgeBase>>(null);
  const [activeTab, setActiveTab] =
    React.useState<KnowledgeBaseTabs>("knowledge_bases");
  const [isProcessed, setIsProcessed] = React.useState(false);
  const [showCreditUsage, setShowCreditUsage] = React.useState(false);
  const [creditUsageTimer, setCreditUsageTimer] =
    React.useState<Nullable<NodeJS.Timeout>>(null);
  const [showWarnDialog, setShowWarnDialog] = React.useState(false);
  const [pendingTabChange, setPendingTabChange] =
    React.useState<Nullable<KnowledgeBaseTabs>>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isAutomaticTabChange, setIsAutomaticTabChange] = React.useState(false);

  const router = useRouter();

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );
  const isLocalEnvironment = env("NEXT_PUBLIC_APP_ENV") === "CE";

  const deleteKnowledgeBase = useDeleteNamespaceKnowledgeBase();
  const knowledgeBases = useListNamespaceKnowledgeBases({
    accessToken,
    namespaceId: selectedNamespace ?? null,
    enabled: enabledQuery && !!selectedNamespace,
  });

  const filesData = useListNamespaceFiles({
    namespaceId: selectedNamespace ?? null,
    knowledgeBaseId: selectedKnowledgeBase?.id ?? null,
    accessToken,
    enabled:
      enabledQuery &&
      Boolean(selectedNamespace) &&
      Boolean(selectedKnowledgeBase),
  });

  // CE has no subscription limits - unlimited storage and knowledge bases
  const updateRemainingSpace = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_fileSize: number, _isAdding: boolean) => {
      // No-op in CE - unlimited storage
    },
    [],
  );

  React.useEffect(() => {
    if (filesData.isSuccess) {
      const hasChunks = filesData.data.some((file) => file.totalChunks > 0);
      setIsProcessed(hasChunks);
    }
  }, [filesData.data, filesData.isSuccess]);

  // CE has no knowledge base limits
  const knowledgeBaseLimit = null;

  const handleTabChangeAttempt = (
    tab: KnowledgeBaseTabs,
    isAutomatic: boolean = false,
  ) => {
    setIsAutomaticTabChange(isAutomatic);
    if (hasUnsavedChanges && !isAutomatic) {
      setShowWarnDialog(true);
      setPendingTabChange(tab);
    } else {
      changeTab(tab);
    }
  };

  const changeTab = React.useCallback(
    (tab: KnowledgeBaseTabs) => {
      setActiveTab(tab);
      if (tab === "knowledge_bases") {
        setSelectedKnowledgeBase(null);
      }
      router.push(`#${tab}`, { scroll: false });
    },
    [router],
  );

  const handleWarnDialogClose = async (): Promise<void> => {
    return new Promise((resolve) => {
      setShowWarnDialog(false);
      setPendingTabChange(null);
      setIsAutomaticTabChange(false);
      resolve();
    });
  };

  const handleWarnDialogDiscard = () => {
    if (pendingTabChange) {
      changeTab(pendingTabChange);
    }
    setShowWarnDialog(false);
    setPendingTabChange(null);
    setHasUnsavedChanges(false);
    setIsAutomaticTabChange(false);
  };

  const handleProcessFile = () => {
    setShowCreditUsage(true);
    handleTabChangeAttempt("files", true);
    setIsProcessed(false);
    setHasUnsavedChanges(false);

    const timer = setTimeout(() => {
      setShowCreditUsage(false);
    }, CREDIT_TIMEOUT);

    setCreditUsageTimer(timer);
  };

  const handleKnowledgeBaseSelect = (knowledgeBase: KnowledgeBase) => {
    handleTabChangeAttempt("upload");
    setSelectedKnowledgeBase(knowledgeBase);
  };

  const handleDeleteKnowledgeBase = async (knowledgeBase: KnowledgeBase) => {
    if (!selectedNamespace || !accessToken) return;

    try {
      await deleteKnowledgeBase.mutateAsync({
        namespaceId: selectedNamespace,
        knowledgeBaseId: knowledgeBase.id,
        accessToken,
      });
      if (selectedKnowledgeBase?.id === knowledgeBase.id) {
        setSelectedKnowledgeBase(null);
        changeTab("knowledge_bases");
      }
      knowledgeBases.refetch();
    } catch (error) {
      toastInstillError({
        title: "Failed to delete knowledge base",
        error,
      });
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
    handleTabChangeAttempt("knowledge_bases");
  };

  React.useEffect(() => {
    setSelectedKnowledgeBase(null);
    changeTab("knowledge_bases");
    setHasUnsavedChanges(false);
  }, [selectedNamespace, changeTab]);

  React.useEffect(() => {
    return () => {
      if (creditUsageTimer) {
        clearTimeout(creditUsageTimer);
      }
    };
  }, [creditUsageTimer]);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as KnowledgeBaseTabs;
      if (
        hash &&
        ["knowledge_bases", "upload", "files", "chunks", "retrieve"].includes(
          hash,
        )
      ) {
        changeTab(hash);
      } else {
        changeTab("knowledge_bases");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [changeTab]);

  return (
    <div className="h-screen w-full bg-semantic-bg-alt-primary">
      {showCreditUsage && !isLocalEnvironment ? (
        <CreditUsageFileNotification
          handleCloseCreditUsageMessage={handleCloseCreditUsageMessage}
          fileName="test"
        />
      ) : null}
      <div className="grid w-full grid-cols-12 gap-6 px-8">
        {selectedKnowledgeBase ? (
          <div className="pt-20 sm:col-span-4 md:col-span-3 lg:col-span-2">
            <Sidebar
              activeTab={activeTab}
              onTabChange={handleTabChangeAttempt}
              selectedKnowledgeBase={selectedKnowledgeBase}
              onDeselectKnowledgeBase={handleDeselectKnowledgeBase}
            />
          </div>
        ) : null}
        <div
          className={cn(
            "pt-5",
            selectedKnowledgeBase
              ? "sm:col-span-8 md:col-span-9 lg:col-span-10"
              : "col-span-12",
          )}
        >
          {activeTab === "knowledge_bases" ? (
            <KnowledgeBaseMainTab
              onKnowledgeBaseSelect={handleKnowledgeBaseSelect}
              onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
              accessToken={props.accessToken}
              knowledgeBases={knowledgeBases.data || []}
              knowledgeBaseLimit={knowledgeBaseLimit}
              namespaceType={null}
              subscription={null}
              isLocalEnvironment={isLocalEnvironment}
            />
          ) : null}
          {activeTab === "files" && selectedKnowledgeBase ? (
            <FilesTab
              knowledgeBase={selectedKnowledgeBase}
              onGoToUpload={handleGoToUpload}
              remainingStorageSpace={Infinity}
              updateRemainingSpace={updateRemainingSpace}
              subscription={null}
              namespaceType={null}
              isLocalEnvironment={isLocalEnvironment}
            />
          ) : null}
          {activeTab === "upload" && selectedKnowledgeBase ? (
            <UploadExploreTab
              knowledgeBase={selectedKnowledgeBase}
              onProcessFile={handleProcessFile}
              onTabChange={(tab) => handleTabChangeAttempt(tab, true)}
              setHasUnsavedChanges={setHasUnsavedChanges}
              remainingStorageSpace={Infinity}
              updateRemainingSpace={updateRemainingSpace}
              subscription={null}
              namespaceType={null}
              isLocalEnvironment={isLocalEnvironment}
              selectedNamespace={selectedNamespace}
            />
          ) : null}
          {activeTab === "chunks" && selectedKnowledgeBase ? (
            <ChunksTab
              knowledgeBase={selectedKnowledgeBase}
              onGoToUpload={handleGoToUpload}
            />
          ) : null}
          {activeTab === "retrieve" && selectedKnowledgeBase ? (
            <SearchChunksTab
              knowledgeBase={selectedKnowledgeBase}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
              namespaceId={selectedNamespace}
              namespaceType={null}
              isLocalEnvironment={isLocalEnvironment}
            />
          ) : null}
        </div>
      </div>
      <WarnDiscardFilesDialog
        open={showWarnDialog && !isAutomaticTabChange}
        setOpen={setShowWarnDialog}
        onCancel={handleWarnDialogClose}
        onDiscard={handleWarnDialogDiscard}
      />
    </div>
  );
};
