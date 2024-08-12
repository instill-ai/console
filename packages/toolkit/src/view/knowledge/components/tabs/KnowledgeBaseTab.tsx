'use client'
import * as React from "react";
import {
  Nullable,
  OrganizationSubscription,
  UserSubscription,
} from "instill-sdk";
import * as z from "zod";

import { Separator, Skeleton } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import {
  useCreateKnowledgeBase,
  useGetKnowledgeBases,
  useUpdateKnowledgeBase,
} from "../../../../lib/react-query-service/knowledge";
import { KnowledgeBase } from "../../../../lib/react-query-service/knowledge/types";
import { CreateKnowledgeBaseCard } from "../CreateKnowledgeBaseCard";
import { CreateKnowledgeDialog } from "../CreateKnowledgeDialog";
import { KnowledgeBaseCard } from "../KnowledgeBaseCard";
import KnowledgeSearchSort, {
  SortAnchor,
  SortOrder,
} from "../KnowledgeSearchSort";
import { UpgradePlanLink } from "../notifications";

type KnowledgeBaseTabProps = {
  onKnowledgeBaseSelect: (knowledgeBase: KnowledgeBase) => void;
  accessToken: Nullable<string>;
  onDeleteKnowledgeBase: (knowledgeBase: KnowledgeBase) => Promise<void>;
  knowledgeBases: KnowledgeBase[];
  knowledgeBaseLimit: number;
  namespaceType: Nullable<"user" | "organization">;
  subscription: Nullable<UserSubscription | OrganizationSubscription>;
  isLocalEnvironment: boolean;
};

type EditKnowledgeDialogData = {
  name: string;
  description?: string;
  tags?: string[];
};

const CreateKnowledgeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  namespaceId: z.string().min(1, { message: "Namespace is required" }),
});

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const KnowledgeBaseTab = ({
  onKnowledgeBaseSelect,
  accessToken,
  onDeleteKnowledgeBase,
  knowledgeBases,
  knowledgeBaseLimit,
  namespaceType,
  subscription,
  isLocalEnvironment
}: KnowledgeBaseTabProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSortOrder, setSelectedSortOrder] =
    React.useState<SortOrder>("desc");
  const [selectedSortAnchor, setSelectedSortAnchor] =
    React.useState<SortAnchor>("createTime");

  const { enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const createKnowledgeBase = useCreateKnowledgeBase();
  const updateKnowledgeBase = useUpdateKnowledgeBase();
  const isTeamPlan = subscription?.plan === "PLAN_ENTERPRISE" || subscription?.plan === "PLAN_TEAM";

  const catalogState = useGetKnowledgeBases({
    accessToken,
    ownerId: selectedNamespace ?? null,
    enabled: enabledQuery && !!selectedNamespace,
  });

  React.useEffect(() => {
    if (selectedNamespace) {
      catalogState.refetch();
    }
  }, [selectedNamespace, catalogState.refetch]);

  const handleCreateKnowledgeSubmit = async (
    data: z.infer<typeof CreateKnowledgeFormSchema>,
  ) => {
    if (!accessToken) return;

    try {
      await createKnowledgeBase.mutateAsync({
        payload: {
          name: data.name,
          description: data.description,
          tags: data.tags ?? [],
          ownerId: data.namespaceId,
        },
        ownerId: data.namespaceId,
        accessToken,
      });
      catalogState.refetch();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating catalog:", error);
    }
  };

  const handleUpdateKnowledgeBase = async (
    data: EditKnowledgeDialogData,
    kbId: string,
  ) => {
    if (!selectedNamespace || !accessToken) return;

    try {
      await updateKnowledgeBase.mutateAsync({
        ownerId: selectedNamespace,
        kbId: kbId,
        payload: {
          name: data.name,
          description: data.description,
          tags: data.tags || [],
        },
        accessToken,
      });
      catalogState.refetch();
    } catch (error) {
      console.error("Error updating catalog:", error);
    }
  };

  const handleCloneKnowledgeBase = async (knowledgeBase: KnowledgeBase) => {
    if (!selectedNamespace || !accessToken) return;

    const clonedKnowledgeBase = {
      name: `${knowledgeBase.name}-clone`,
      description: knowledgeBase.description,
      tags: knowledgeBase.tags || [],
    };

    try {
      await createKnowledgeBase.mutateAsync({
        payload: {
          ...clonedKnowledgeBase,
          ownerId: selectedNamespace,
        },
        ownerId: selectedNamespace,
        accessToken,
      });
      catalogState.refetch();
    } catch (error) {
      console.error("Error cloning catalog:", error);
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

  const hasReachedLimit =
    filteredAndSortedKnowledgeBases.length >= knowledgeBaseLimit;

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex justify-start space-x-2  items-center">
          <p className="text-semantic-fg-primary product-headings-heading-2">
            Catalogs
          </p>
          <p className=" product-body-text-3-regular space-x-2">
            <span className="text-semantic-fg-secondary">
              {isLocalEnvironment || isTeamPlan
                ? `(${filteredAndSortedKnowledgeBases.length})`
                : `(${filteredAndSortedKnowledgeBases.length}/${knowledgeBaseLimit})`}
            </span>
            {!isLocalEnvironment && !isTeamPlan && (
              <UpgradePlanLink
                plan={subscription?.plan || "PLAN_FREE"}
                namespaceType={namespaceType}
                pageName="catalog"
              />
            )}
          </p>
        </div>
        <KnowledgeSearchSort
          selectedSortOrder={selectedSortOrder}
          setSelectedSortOrder={setSelectedSortOrder}
          selectedSortAnchor={selectedSortAnchor}
          setSelectedSortAnchor={setSelectedSortAnchor}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      {catalogState.isLoading ? (
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
              key={knowledgeBase.kbId || knowledgeBase.name}
              knowledgeBase={knowledgeBase}
              onCardClick={() => onKnowledgeBaseSelect(knowledgeBase)}
              onUpdateKnowledgeBase={handleUpdateKnowledgeBase}
              onCloneKnowledgeBase={handleCloneKnowledgeBase}
              onDeleteKnowledgeBase={onDeleteKnowledgeBase}
              disabled={hasReachedLimit}
            />
          ))}
        </div>
      )}
      <CreateKnowledgeDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateKnowledgeSubmit}
      />
    </div>
  );
};
