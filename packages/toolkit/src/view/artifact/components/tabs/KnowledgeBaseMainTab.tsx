"use client";

import * as React from "react";
import { isAxiosError } from "axios";
import {
  CreateKnowledgeBaseRequest,
  KnowledgeBase,
  Nullable,
  UpdateKnowledgeBaseRequest,
} from "instill-sdk";
import * as z from "zod";

import { Separator, Skeleton } from "@instill-ai/design-system";

import {
  InstillStore,
  toastInstillError,
  useCreateNamespaceKnowledgeBase,
  useInstillStore,
  useListNamespaceKnowledgeBases,
  useShallow,
  useUpdateNamespaceKnowledgeBase,
} from "../../../../lib";
import type {
  OrganizationSubscription,
  UserSubscription,
} from "../lib/helpers";
import { CreateKnowledgeBaseCard } from "../CreateKnowledgeBaseCard";
import {
  CreateKnowledgeBaseDialog,
  CreateKnowledgeBaseFormSchema,
} from "../CreateKnowledgeBaseDialog";
import { EditKnowledgeBaseDialogData } from "../EditKnowledgeBaseDialog";
import { KnowledgeBaseCard } from "../KnowledgeBaseCard";
import KnowledgeBaseSearchSort, {
  SortAnchor,
  SortOrder,
} from "../KnowledgeBaseSearchSort";
import { convertTagsToArray } from "../lib/helpers";

//import { UpgradePlanLink } from "../notifications";

type KnowledgeBaseMainTabProps = {
  onKnowledgeBaseSelect: (knowledgeBase: KnowledgeBase) => void;
  accessToken: Nullable<string>;
  onDeleteKnowledgeBase: (knowledgeBase: KnowledgeBase) => Promise<void>;
  knowledgeBases: KnowledgeBase[];
  knowledgeBaseLimit: Nullable<number>;
  namespaceType: Nullable<"user" | "organization">;
  subscription: Nullable<UserSubscription | OrganizationSubscription>;
  isLocalEnvironment: boolean;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const KnowledgeBaseMainTab = ({
  onKnowledgeBaseSelect,
  accessToken,
  onDeleteKnowledgeBase,
  knowledgeBases,
  //knowledgeBaseLimit,
  //namespaceType,
  //subscription,
  isLocalEnvironment,
}: KnowledgeBaseMainTabProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSortOrder, setSelectedSortOrder] =
    React.useState<SortOrder>("desc");
  const [selectedSortAnchor, setSelectedSortAnchor] =
    React.useState<SortAnchor>("createTime");

  const { enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const createKnowledgeBase = useCreateNamespaceKnowledgeBase();
  const updateKnowledgeBase = useUpdateNamespaceKnowledgeBase();
  //const isEnterprisePlan = subscription?.plan === "PLAN_ENTERPRISE";
  //const isTeamPlan = subscription?.plan === "PLAN_TEAM";

  const knowledgeBaseState = useListNamespaceKnowledgeBases({
    accessToken,
    namespaceId: selectedNamespace ?? null,
    enabled: enabledQuery && !!selectedNamespace,
  });

  React.useEffect(() => {
    if (selectedNamespace) {
      knowledgeBaseState.refetch();
    }
  }, [selectedNamespace, knowledgeBaseState.refetch, knowledgeBaseState]);

  const handleCreateKnowledgeBaseSubmit = async (
    data: z.infer<typeof CreateKnowledgeBaseFormSchema>,
  ) => {
    if (!accessToken) return;

    const payload: CreateKnowledgeBaseRequest = {
      id: data.name,
      description: data.description,
      tags: convertTagsToArray(data.tags),
      namespaceId: data.namespaceId,
    };

    try {
      await createKnowledgeBase.mutateAsync({
        payload,
        accessToken,
      });
      knowledgeBaseState.refetch();
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Handle 409 conflict error (knowledge base name already exists)
      if (isAxiosError(error) && error.response?.status === 409) {
        // Re-throw to be handled by the dialog
        throw error;
      }

      // Handle other errors with toast
      toastInstillError({
        title: "Failed to create knowledge base",
        error,
      });
    }
  };

  const handleUpdateKnowledgeBase = async (
    data: EditKnowledgeBaseDialogData,
    knowledgeBaseId: string,
  ) => {
    if (!selectedNamespace || !accessToken) return;

    const payload: UpdateKnowledgeBaseRequest = {
      namespaceId: selectedNamespace,
      knowledgeBaseId: knowledgeBaseId,
      knowledgeBase: {
        description: data.description,
        tags: convertTagsToArray(data.tags),
      },
      updateMask: "description,tags",
    };

    try {
      await updateKnowledgeBase.mutateAsync({
        payload,
        accessToken,
      });
      knowledgeBaseState.refetch();
    } catch (error) {
      // Handle errors with toast notification
      toastInstillError({
        title: "Failed to update knowledge base",
        error,
      });
    }
  };

  const handleCloneKnowledgeBase = async (
    knowledgeBase: KnowledgeBase,
    newNamespaceId: string,
  ) => {
    if (!accessToken) return;

    const clonedKnowledgeBase: CreateKnowledgeBaseRequest = {
      id: `${knowledgeBase.id}-clone`,
      description: knowledgeBase.description ?? "",
      tags: knowledgeBase.tags ?? [],
      namespaceId: newNamespaceId,
    };

    try {
      await createKnowledgeBase.mutateAsync({
        payload: clonedKnowledgeBase,
        accessToken,
      });
      knowledgeBaseState.refetch();
    } catch (error) {
      // Handle errors with toast notification
      toastInstillError({
        title: "Failed to clone knowledge base",
        error,
      });
    }
  };

  const filteredAndSortedKnowledgeBases = React.useMemo(() => {
    const filtered = knowledgeBases.filter(
      (kb) =>
        kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kb.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (selectedSortAnchor) {
        case "createTime":
          aValue = new Date(a.createTime).getTime();
          bValue = new Date(b.createTime).getTime();
          break;
        case "modifyTime":
          aValue = new Date(a.updateTime).getTime();
          bValue = new Date(b.updateTime).getTime();
          break;
        case "usage":
          aValue = a.usage || 0;
          bValue = b.usage || 0;
          break;
        default:
          return 0;
      }

      if (selectedSortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [knowledgeBases, searchTerm, selectedSortAnchor, selectedSortOrder]);

  const hasReachedLimit = false; // filteredAndSortedKnowledgeBases.length >= knowledgeBaseLimit;

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex justify-start space-x-2  items-center">
          <p className="text-semantic-fg-primary product-headings-heading-2">
            Knowledge Bases
          </p>
          {/* <p className=" product-body-text-3-regular space-x-2">
            <span className="text-semantic-fg-secondary">
              {isLocalEnvironment || isEnterprisePlan || isTeamPlan
                ? `(${filteredAndSortedKnowledgeBases.length})`
                : `(${filteredAndSortedKnowledgeBases.length}/${knowledgeBaseLimit})`}
            </span>
            {!isLocalEnvironment && !isEnterprisePlan ? (
              <UpgradePlanLink
                plan={subscription?.plan || "PLAN_FREE"}
                namespaceType={namespaceType}
                selectedNamespace={selectedNamespace}
              />
            ) : null}
          </p> */}
        </div>
        <KnowledgeBaseSearchSort
          selectedSortOrder={selectedSortOrder}
          setSelectedSortOrder={setSelectedSortOrder}
          selectedSortAnchor={selectedSortAnchor}
          setSelectedSortAnchor={setSelectedSortAnchor}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {knowledgeBaseState.isLoading ? (
        <div className="grid gap-16 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex h-[175px] w-[360px] flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32 rounded bg-semantic-bg-line" />
                <Skeleton className="h-6 w-6 rounded bg-semantic-bg-line" />
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-full rounded bg-semantic-bg-line" />
                <Skeleton className="h-4 w-2/3 rounded bg-semantic-bg-line" />
              </div>
              <div className="flex items-end justify-end">
                <Skeleton className="h-8 w-8 rounded bg-semantic-bg-line" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,360px)] justify-start gap-[15px]">
          <KnowledgeBaseCard
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={isLocalEnvironment ? false : hasReachedLimit}
          />
          {filteredAndSortedKnowledgeBases.map((knowledgeBase) => (
            <CreateKnowledgeBaseCard
              key={knowledgeBase.id || knowledgeBase.id}
              knowledgeBase={knowledgeBase}
              onCardClick={() => onKnowledgeBaseSelect(knowledgeBase)}
              onUpdateKnowledgeBase={handleUpdateKnowledgeBase}
              onCloneKnowledgeBase={handleCloneKnowledgeBase}
              onDeleteKnowledgeBase={onDeleteKnowledgeBase}
            />
          ))}
        </div>
      )}
      <CreateKnowledgeBaseDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateKnowledgeBaseSubmit}
      />
    </div>
  );
};
