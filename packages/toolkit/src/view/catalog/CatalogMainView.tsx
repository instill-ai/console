"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Nullable } from "instill-sdk";

import { cn } from "@instill-ai/design-system";

import {
  GeneralAppPageProp,
  InstillStore,
  useAuthenticatedUserSubscription,
  useInstillStore,
  useOrganizationSubscription,
  useShallow,
} from "../../lib";
import {
  useDeleteCatalog,
  useGetCatalogs,
  useListCatalogFiles,
} from "../../lib/react-query-service/catalog";
import { Catalog } from "../../lib/react-query-service/catalog/types";
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

export type CatalogViewProps = GeneralAppPageProp;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const CatalogMainView = (props: CatalogViewProps) => {
  const [selectedCatalog, setSelectedCatalog] =
    React.useState<Nullable<Catalog>>(null);
  const [activeTab, setActiveTab] = React.useState("catalogs");
  const [isProcessed, setIsProcessed] = React.useState(false);
  const [showCreditUsage, setShowCreditUsage] = React.useState(false);
  const [creditUsageTimer, setCreditUsageTimer] =
    React.useState<Nullable<NodeJS.Timeout>>(null);
  const [showWarnDialog, setShowWarnDialog] = React.useState(false);
  const [pendingTabChange, setPendingTabChange] =
    React.useState<Nullable<string>>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [remainingStorageSpace, setRemainingStorageSpace] = React.useState(0);
  const [namespaceType, setNamespaceType] =
    React.useState<Nullable<"user" | "organization">>(null);
  const [isAutomaticTabChange, setIsAutomaticTabChange] = React.useState(false);

  const router = useRouter();

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );
  const isLocalEnvironment = env("NEXT_PUBLIC_APP_ENV") === "CE";

  const deleteCatalog = useDeleteCatalog();
  const catalogs = useGetCatalogs({
    accessToken,
    ownerId: selectedNamespace ?? null,
    enabled: enabledQuery && !!selectedNamespace,
  });

  const filesData = useListCatalogFiles({
    namespaceId: selectedNamespace ?? null,
    catalogId: selectedCatalog?.catalogId ?? "",
    accessToken,
    enabled:
      enabledQuery && Boolean(selectedNamespace) && Boolean(selectedCatalog),
  });

  const userSub = useAuthenticatedUserSubscription({
    enabled: enabledQuery,
    accessToken,
  });

  const orgSub = useOrganizationSubscription({
    organizationID: selectedNamespace ? selectedNamespace : null,
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
        (total, kb) => total + parseInt(String(kb.usedStorage)),
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

  const handleTabChangeAttempt = (
    tab: string,
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
    (tab: string) => {
      setActiveTab(tab);
      if (tab === "catalogs") {
        setSelectedCatalog(null);
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

  const handleCatalogSelect = (catalog: Catalog) => {
    handleTabChangeAttempt("upload");
    setSelectedCatalog(catalog);
  };

  const handleDeleteCatalog = async (catalog: Catalog) => {
    if (!selectedNamespace || !accessToken) return;

    try {
      await deleteCatalog.mutateAsync({
        ownerId: selectedNamespace,
        catalogId: catalog.catalogId,
        accessToken,
      });
      if (selectedCatalog?.catalogId === catalog.catalogId) {
        setSelectedCatalog(null);
        changeTab("catalogs");
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
    setSelectedCatalog(null);
    changeTab("catalogs");
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
      const hash = window.location.hash.slice(1);
      if (
        hash &&
        [
          "catalogs",
          "upload",
          "files",
          "chunks",
          "retrieve",
          "ask_question",
          "get_catalog",
        ].includes(hash)
      ) {
        changeTab(hash);
      } else {
        changeTab("catalogs");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [catalogs.data, changeTab]);

  return (
    <div className="h-screen w-full bg-semantic-bg-alt-primary">
      {showCreditUsage && !isLocalEnvironment ? (
        <CreditUsageFileNotification
          handleCloseCreditUsageMessage={handleCloseCreditUsageMessage}
          fileName="test"
        />
      ) : null}
      <div className="grid w-full grid-cols-12 gap-6 px-8">
        {selectedCatalog ? (
          <div className="pt-20 sm:col-span-4 md:col-span-3 lg:col-span-2">
            <Sidebar
              activeTab={activeTab}
              onTabChange={handleTabChangeAttempt}
              selectedCatalog={selectedCatalog}
              onDeselectCatalog={handleDeselectCatalog}
            />
          </div>
        ) : null}
        <div
          className={cn(
            "pt-5",
            selectedCatalog
              ? "sm:col-span-8 md:col-span-9 lg:col-span-10"
              : "col-span-12",
          )}
        >
          {activeTab === "catalogs" ? (
            <CatalogTab
              onCatalogSelect={handleCatalogSelect}
              onDeleteCatalog={handleDeleteCatalog}
              accessToken={props.accessToken}
              catalogs={catalogs.data || []}
              catalogLimit={catalogLimit}
              namespaceType={namespaceType}
              subscription={subscriptionInfo.subscription}
              isLocalEnvironment={isLocalEnvironment}
            />
          ) : null}
          {activeTab === "files" && selectedCatalog ? (
            <CatalogFilesTab
              catalog={selectedCatalog}
              onGoToUpload={handleGoToUpload}
              remainingStorageSpace={remainingStorageSpace}
              updateRemainingSpace={updateRemainingSpace}
              subscription={subscriptionInfo.subscription}
              namespaceType={namespaceType}
              isLocalEnvironment={isLocalEnvironment}
            />
          ) : null}
          {activeTab === "upload" && selectedCatalog ? (
            <UploadExploreTab
              catalog={selectedCatalog}
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
          ) : null}
          {activeTab === "chunks" && selectedCatalog ? (
            <ChunkTab
              catalog={selectedCatalog}
              onGoToUpload={handleGoToUpload}
            />
          ) : null}
          {activeTab === "retrieve" && selectedCatalog ? (
            <RetrieveTestTab
              catalog={selectedCatalog}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
              namespaceId={selectedNamespace}
            />
          ) : null}
          {activeTab === "ask_question" && selectedCatalog ? (
            <AskQuestionTab
              catalog={selectedCatalog}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
              namespaceId={selectedNamespace}
            />
          ) : null}
          {activeTab === "get_catalog" && selectedCatalog ? (
            <GetCatalogTab
              catalog={selectedCatalog}
              isProcessed={isProcessed}
              onGoToUpload={handleGoToUpload}
              namespaceId={selectedNamespace}
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
