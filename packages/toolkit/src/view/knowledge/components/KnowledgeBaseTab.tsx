import { Icons, Input, Separator, Skeleton } from "@instill-ai/design-system";
import * as React from "react";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import { CreateKnowledgeBaseCard } from "./CreateKnowledgeBaseCard";
import { CreateKnowledgeDialog } from "./CreateKnowledgeDialog";
import {
  useGetKnowledgeBases,
  useCreateKnowledgeBase,
  useUpdateKnowledgeBase,
} from "../../../lib/react-query-service/knowledge";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
  // Nullable,
  // useUserMemberships,
} from "../../../lib";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import * as z from "zod";
import KnowledgeSearchSort, { SortAnchor, SortOrder } from "./KnowledgeSearchSort";

type KnowledgeBaseTabProps = {
  onKnowledgeBaseSelect: (knowledgeBase: KnowledgeBase) => void;
  onDeleteKnowledgeBase: (knowledgeBase: KnowledgeBase) => void;
  accessToken: string | null;
};

const CreateKnowledgeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tags: z.array(z.string()).optional(),
  namespaceId: z.string().min(1, { message: "Namespace is required" }),
});

export const KnowledgeBaseTab = ({
  onKnowledgeBaseSelect,
  //   onDeleteKnowledgeBase,
  accessToken,
}: KnowledgeBaseTabProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [knowledgeBases, setKnowledgeBases] = React.useState<KnowledgeBase[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSortOrder, setSelectedSortOrder] = React.useState<SortOrder>("desc");
  const [selectedSortAnchor, setSelectedSortAnchor] = React.useState<SortAnchor>("createTime");

  const { enabledQuery } = useInstillStore(
    useShallow((store: InstillStore) => ({
      enabledQuery: store.enabledQuery,
    }))
  );

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const getKnowledgeBases = useGetKnowledgeBases({
    accessToken,
    ownerId: me.data?.id ?? null,
    enabled: enabledQuery && !!me.data?.id,
  });

  const createKnowledgeBase = useCreateKnowledgeBase();
  const updateKnowledgeBase = useUpdateKnowledgeBase();

  React.useEffect(() => {
    if (getKnowledgeBases.data) {
      setKnowledgeBases(getKnowledgeBases.data);
      setLoading(false);
    }
  }, [getKnowledgeBases.data]);

  const handleCreateKnowledgeSubmit = async (
    data: z.infer<typeof CreateKnowledgeFormSchema>
  ) => {
    if (!me.data?.id || !accessToken) return;

    try {
      const newKnowledgeBase = await createKnowledgeBase.mutateAsync({
        payload: {
          name: data.name,
          description: data.description,
          tags: data.tags ?? [],
        },
        ownerId: me.data.id,
        accessToken,
      });

      if (newKnowledgeBase && newKnowledgeBase.kbId) {
        setKnowledgeBases((prevKnowledgeBases) => [
          ...prevKnowledgeBases,
          newKnowledgeBase,
        ]);
      } else {
        console.error("Created knowledge base is missing kbId");
      }
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating knowledge base:", error);
    }
  };

  const handleUpdateKnowledgeBase = async (
    data: EditKnowledgeDialogData,
    kbId: string
  ) => {
    if (!me.data?.id || !accessToken) return;

    try {
      const updatedKnowledgeBase = await updateKnowledgeBase.mutateAsync({
        ownerId: me.data.id,
        kbId: kbId,
        payload: data,
        accessToken,
      });

      if (updatedKnowledgeBase) {
        setKnowledgeBases((prevKnowledgeBases) =>
          prevKnowledgeBases.map((kb) =>
            kb.kbId === kbId ? updatedKnowledgeBase : kb
          )
        );
      }
    } catch (error) {
      console.error("Error updating knowledge base:", error);
    }
  };

  const handleCloneKnowledgeBase = async (knowledgeBase: KnowledgeBase) => {
    if (!me.data?.id || !accessToken) return;

    const clonedKnowledgeBase = {
      name: `${knowledgeBase.name}-clone`,
      description: knowledgeBase.description,
      tags: knowledgeBase.tags || [],
    };

    try {
      const newKnowledgeBase = await createKnowledgeBase.mutateAsync({
        payload: clonedKnowledgeBase,
        ownerId: me.data.id,
        accessToken,
      });

      if (newKnowledgeBase) {
        setKnowledgeBases((prevKnowledgeBases) => [
          ...prevKnowledgeBases,
          newKnowledgeBase,
        ]);
      }
    } catch (error) {
      console.error("Error cloning knowledge base:", error);
    }
  };


  const filteredAndSortedKnowledgeBases = React.useMemo(() => {
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

  const hasReachedLimit = knowledgeBases.length >= 3;

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
      {loading ? (
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
