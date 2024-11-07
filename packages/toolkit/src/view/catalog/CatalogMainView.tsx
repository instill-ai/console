"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  InstillStore,
  useAuthenticatedUserSubscription,
  useDeleteNamespaceCatalog,
  useInstillStore,
  useListNamespaceCatalogFiles,
  useListNamespaceCatalogs,
  useOrganizationSubscription,
  useShallow,
} from "../../lib";
import { env } from "../../server";
import { Sidebar, WarnDiscardFilesDialog } from "./components";
import { CREDIT_TIMEOUT } from "./components/lib/constant";
import {
  calculateRemainingStorage,
  checkNamespaceType,
  getCatalogLimit,
  getSubscriptionInfo,
} from "./components/lib/helpers";
import { CreditUsageFileNotification } from "./components/notifications";
import {
  AskQuestionTab,
  CatalogFilesTab,
  CatalogTab,
  ChunkTab,
  GetCatalogTab,
  RetrieveTestTab,
  UploadExploreTab,
} from "./components/tabs";
import { cn } from "@instill-ai/design-system";
import { Nullable, Catalog } from "instill-sdk";

type CatalogViewProps  = {
  activeTab: string;
  catalogId?: string;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const CatalogMainView = (props: CatalogViewProps) => {
  const { catalogId, activeTab } = props;
  const [isProcessed, setIsProcessed] = React.useState(false);
  const [showCreditUsage, setShowCreditUsage] = React.useState(false);
  const [creditUsageTimer, setCreditUsageTimer] = React.useState<Nullable<NodeJS.Timeout>>(null);
  const [showWarnDialog, setShowWarnDialog] = React.useState(false);
  const [pendingTabChange, setPendingTabChange] = React.useState<Nullable<string>>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [remainingStorageSpace, setRemainingStorageSpace] = React.useState(0);
  const [namespaceType, setNamespaceType] = React.useState<Nullable<"user" | "organization">>(null);
  const [isAutomaticTabChange, setIsAutomaticTabChange] = React.useState(false);

  const router = useRouter();

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );
  const isLocalEnvironment = env("NEXT_PUBLIC_APP_ENV") === "CE";

  const deleteCatalog = useDeleteNamespaceCatalog();
  const catalogs = useListNamespaceCatalogs({
    accessToken,
    namespaceId: selectedNamespace ?? null,
    enabled: enabledQuery && !!selectedNamespace,
  });

  const filesData = useListNamespaceCatalogFiles({
    namespaceId: selectedNamespace ?? null,
    catalogId: catalogId ?? null,
    accessToken,
    enabled:
      enabledQuery && Boolean(selectedNamespace) && Boolean(catalogId),
  });

  const userSub = useAuthenticatedUserSubscription({
    enabled: enabledQuery,
    accessToken,
  });

  const orgSub = useOrganizationSubscription({
    organizationId: selectedNamespace ? selectedNamespace : null,
    accessToken,
    enabled: enabledQuery && namespaceType === "organization",
  });

  const subscriptionInfo = React.useMemo(() => {
    return getSubscriptionInfo(
      namespaceType,
      userSub.data || null,
      orgSub.data || null,
    );
  }, [namespaceType, userSub.data, orgSub.data]);

  React.useEffect(() => {
    const getNamespaceType = async () => {
      if (selectedNamespace && accessToken) {
        const type = await checkNamespaceType(selectedNamespace, accessToken);
        setNamespaceType(type);
      } else {
        setNamespaceType(null);
      }
    };

    getNamespaceType();
  }, [selectedNamespace, accessToken]);

  React.useEffect(() => {
    if (catalogs.data) {
      const totalUsed = catalogs.data.reduce(
        (total, kb) => total + parseInt(String(kb.usedStorage), 10),
        0,
      );
      setRemainingStorageSpace(
        calculateRemainingStorage(subscriptionInfo.planStorageLimit, totalUsed),
      );
    }
  }, [catalogs.data, subscriptionInfo.planStorageLimit]);

  const updateRemainingSpace = React.useCallback(
    (fileSize: number, isAdding: boolean) => {
      setRemainingStorageSpace((prev) => {
        const newUsedStorage = isAdding
          ? subscriptionInfo.planStorageLimit - prev + fileSize
          : subscriptionInfo.planStorageLimit - prev - fileSize;
        return calculateRemainingStorage(
          subscriptionInfo.planStorageLimit,
          newUsedStorage,
        );
      });
    },
    [subscriptionInfo.planStorageLimit],
  );

  React.useEffect(() => {
    if (filesData.isSuccess) {
      const hasChunks = filesData.data.some((file) => file.totalChunks > 0);
      setIsProcessed(hasChunks);
    }
  }, [filesData.data, filesData.isSuccess]);

  const catalogLimit = React.useMemo(
    () => getCatalogLimit(subscriptionInfo.plan),
    [subscriptionInfo.plan],
  );

  const selectedCatalogMemo = React.useMemo(() => {
    if (catalogId && catalogs.data) {
      return catalogs.data.find((c) => c.catalogId === catalogId) || null;
    }
    return null;
  }, [catalogId, catalogs.data]);

  const handleTabChangeAttempt = (
    tab: string,
    isAutomatic: boolean = false,
  ) => {
    setIsAutomaticTabChange(isAutomatic);
    if (hasUnsavedChanges && !isAutomatic) {
      setShowWarnDialog(true);
      setPendingTabChange(tab);
    } else {
      if (tab === "catalogs") {
        router.push(`/${selectedNamespace}/catalog`, { scroll: false });
      } else {
        router.push(`/${selectedNamespace}/catalog/${catalogId}/${tab}`, { scroll: false });
      }
    }
  };

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
      if (pendingTabChange === "catalogs") {
        router.push(`/${selectedNamespace}/catalog`, { scroll: false });
      } else {
        router.push(`/${selectedNamespace}/catalog/${catalogId}/${pendingTabChange}`, { scroll: false });
      }
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

  const handleCatalogSelect = (catalog: Catalog) => {
    router.push(`/${selectedNamespace}/catalog/${catalog.catalogId}/upload`, { scroll: false });
  };

  const handleDeleteCatalog = async (catalog: Catalog) => {
    if (!selectedNamespace || !accessToken) return;

    try {
      await deleteCatalog.mutateAsync({
        namespaceId: selectedNamespace,
        catalogId: catalog.catalogId,
        accessToken,
      });
      if (catalogId === catalog.catalogId) {
        handleTabChangeAttempt("catalogs");
      }
      catalogs.refetch();
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

  const handleDeselectCatalog = () => {
    handleTabChangeAttempt("catalogs");
  };

  React.useEffect(() => {
    return () => {
      if (creditUsageTimer) {
        clearTimeout(creditUsageTimer);
      }
    };
  }, [creditUsageTimer]);

  return (
    <div className="h-screen w-full bg-semantic-bg-alt-primary">
      {showCreditUsage && !isLocalEnvironment ? (
        <CreditUsageFileNotification
          handleCloseCreditUsageMessage={handleCloseCreditUsageMessage}
          fileName="test"
        />
      ) : null}
      <div className="grid w-full grid-cols-12 gap-6 px-8">
        {selectedCatalogMemo ? (
          <div className="pt-20 sm:col-span-4 md:col-span-3 lg:col-span-2">
            <Sidebar
              activeTab={activeTab}
              onTabChange={handleTabChangeAttempt}
              selectedCatalog={selectedCatalogMemo}
              onDeselectCatalog={handleDeselectCatalog}
            />
          </div>
        ) : null}
        <div
          className={cn(
            "pt-5",
            selectedCatalogMemo
              ? "sm:col-span-8 md:col-span-9 lg:col-span-10"
              : "col-span-12",
          )}
        >
          {activeTab === "catalogs" && (
            <CatalogTab
              onCatalogSelect={handleCatalogSelect}
              onDeleteCatalog={handleDeleteCatalog}
              accessToken={accessToken}
              catalogs={catalogs.data || []}
              catalogLimit={catalogLimit}
              namespaceType={namespaceType}
              subscription={subscriptionInfo.subscription}
              isLocalEnvironment={isLocalEnvironment}
            />
          )}
          {activeTab === "files" && selectedCatalogMemo && (
            <CatalogFilesTab
              catalog={selectedCatalogMemo}
              onGoToUpload={handleGoToUpload}
              remainingStorageSpace={remainingStorageSpace}
              updateRemainingSpace={updateRemainingSpace}
              subscription={subscriptionInfo.subscription}
              namespaceType={namespaceType}
              isLocalEnvironment={isLocalEnvironment}
            />
          )}
          {activeTab === "upload" && selectedCatalogMemo && (
            <UploadExploreTab
              catalog={selectedCatalogMemo}
              onProcessFile={handleProcessFile}
              onTabChange={(tab) => handleTabChangeAttempt(tab, true)}
              setHasUnsavedChanges={setHasUnsavedChanges}
              remainingStorageSpace={remainingStorageSpace}
              updateRemainingSpace={updateRemainingSpace}
              subscription={subscriptionInfo.subscription}
              namespaceType={namespaceType}
              isLocalEnvironment={isLocalEnvironment}
              selectedNamespace={selectedNamespace}
            />
          )}
          {activeTab === "chunks" && selectedCatalogMemo && (
            <ChunkTab
              catalog={selectedCatalogMemo}
              onGoToUpload={handleGoToUpload}
            />
          )}
          {activeTab === "retrieve" && selectedCatalogMemo && (
            <RetrieveTestTab
              catalog={selectedCatalogMemo}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
              namespaceId={selectedNamespace}
              namespaceType={namespaceType}
              isLocalEnvironment={isLocalEnvironment}
            />
          )}
          {activeTab === "ask_question" && selectedCatalogMemo && (
            <AskQuestionTab
              catalog={selectedCatalogMemo}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
              namespaceId={selectedNamespace}
              namespaceType={namespaceType}
              isLocalEnvironment={isLocalEnvironment}
            />
          )}
          {activeTab === "get_catalog" && selectedCatalogMemo && (
            <GetCatalogTab
              catalog={selectedCatalogMemo}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
              namespaceId={selectedNamespace}
            />
          )}
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
