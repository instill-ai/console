import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Separator, Skeleton } from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../../../sdk/src/vdp/artifact/types";
import { InstillStore, useAuthenticatedUser, useInstillStore, useShallow } from "../../../lib";
import * as z from "zod";
import KnowledgeSearchSort, { SortAnchor, SortOrder } from "../components/KnowledgeSearchSort";
import { CreateKnowledgeBaseCard, CreateKnowledgeDialog, KnowledgeBaseCard } from "../components";
import { useListKnowledgeBases } from '../../../lib/react-query-service/knowledge/useListKnowledgeBases';
import { getInstillArtifactAPIClient } from "../../../lib/vdp-sdk";

const CreateKnowledgeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tags: z.array(z.string()).optional(),
  namespaceId: z.string().min(1, { message: "Namespace is required" }),
});

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const KnowledgeBaseTab: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSortOrder, setSelectedSortOrder] = React.useState<SortOrder>("desc");
  const [selectedSortAnchor, setSelectedSortAnchor] = React.useState<SortAnchor>("createTime");

  const queryClient = useQueryClient();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const { data: knowledgeBases, isLoading: isLoadingKnowledgeBases } = useListKnowledgeBases({
    ownerId: me.data?.id || "",
    accessToken,
    enabled: enabledQuery && !!me.data?.id && !!accessToken,
  });

  const createKnowledgeBaseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof CreateKnowledgeFormSchema>) => {
      if (!accessToken || !me.data?.id) {
        throw new Error("Not authenticated");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      return client.vdp.artifact.createKnowledgeBase({
        ownerId: me.data.id,
        payload: {
          name: data.name,
          description: data.description,
          tags: data.tags ?? [],
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledgeBases', me.data?.id]);
      setIsCreateDialogOpen(false);
    },
  });

  const updateKnowledgeBaseMutation = useMutation({
    mutationFn: async ({ data, kbId }: { data: any; kbId: string }) => {
      if (!accessToken || !me.data?.id) {
        throw new Error("Not authenticated");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      return client.vdp.artifact.updateKnowledgeBase({
        ownerId: me.data.id,
        kbId,
        payload: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledgeBases', me.data?.id]);
    },
  });

  const deleteKnowledgeBaseMutation = useMutation({
    mutationFn: async (kbId: string) => {
      if (!accessToken || !me.data?.id) {
        throw new Error("Not authenticated");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      return client.vdp.artifact.deleteKnowledgeBase({
        ownerId: me.data.id,
        kbId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledgeBases', me.data?.id]);
    },
  });

  const handleCreateKnowledgeSubmit = (data: z.infer<typeof CreateKnowledgeFormSchema>) => {
    createKnowledgeBaseMutation.mutate(data);
  };

  const handleUpdateKnowledgeBase = (data: any, kbId: string) => {
    updateKnowledgeBaseMutation.mutate({ data, kbId });
  };

  const handleDeleteKnowledgeBase = (kbId: string) => {
    deleteKnowledgeBaseMutation.mutate(kbId);
  };

  const filteredAndSortedKnowledgeBases = React.useMemo(() => {
    if (!knowledgeBases) return [];

    let filtered = knowledgeBases.filter((kb) =>
      kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kb.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const hasReachedLimit = (knowledgeBases?.length ?? 0) >= 3;
  return (
    <div className="flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
          Knowledge bases
        </p>
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
      {isLoadingKnowledgeBases ? (
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
            disabled={hasReachedLimit}
          />
          {filteredAndSortedKnowledgeBases.map((knowledgeBase) => (
            <CreateKnowledgeBaseCard
              key={knowledgeBase.kbId || knowledgeBase.name}
              knowledgeBase={knowledgeBase}
              onCardClick={() => onKnowledgeBaseSelect(knowledgeBase)}
              onUpdateKnowledgeBase={handleUpdateKnowledgeBase}
              onCloneKnowledgeBase={handleCloneKnowledgeBase}
              onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
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
