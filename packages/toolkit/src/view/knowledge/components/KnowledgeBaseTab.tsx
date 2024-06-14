import { Separator, Skeleton } from "@instill-ai/design-system";
import * as React from "react";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import { CreateKnowledgeBaseCard } from "./CreateKnowledgeBaseCard";
import { CreateKnowledgeDialog } from "./CreateKnowledgeDialog";
import {
  useGetKnowledgeBases,
  useCreateKnowledgeBase,
} from "../../../lib/react-query-service/knowledge";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";

type KnowledgeBaseTabProps = {
  onKnowledgeBaseSelect: (knowledgeBase: KnowledgeBase) => void;
  onDeleteKnowledgeBase: (knowledgeBase: KnowledgeBase) => void;
  accessToken: string | null;
};

export const KnowledgeBaseTab = ({
  onKnowledgeBaseSelect,
  //   onDeleteKnowledgeBase,
  accessToken
}: KnowledgeBaseTabProps) => {
  const [loading, setLoading] = React.useState(false);

  const selector = (store: InstillStore) => ({
    accessToken: store.accessToken,
    enabledQuery: store.enabledQuery,
  });

  const {  enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });
  const userID = me.isSuccess ? me.data.id : null;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [knowledgeBases, setKnowledgeBases] = React.useState<KnowledgeBase[]>(
    []
  );
  const getKnowledgeBases = useGetKnowledgeBases({
    accessToken,
    uid: userID as string,
    enabled: true,
  });
  const createKnowledgeBase = useCreateKnowledgeBase();

  React.useEffect(() => {
    setLoading(true);
    getKnowledgeBases.refetch().then((result) => {
      setKnowledgeBases(result.data || []);
      setLoading(false);
    });
  }, [userID, accessToken]);

  const handleCreateKnowledgeSubmit = (data: {
    name: string;
    description: string;
    tags?: string[];
  }) => {
    createKnowledgeBase.mutate(
      {
        payload: {
          ...data,
          tags: data.tags ?? [],
        },
        accessToken,
      },
      {
        onSuccess: (newKnowledgeBase) => {
          setKnowledgeBases([...knowledgeBases, newKnowledgeBase]);
          setIsCreateDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
          Knowledge Base
        </p>
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
        <div className="grid gap-16 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <KnowledgeBaseCard onClick={() => setIsCreateDialogOpen(true)} />
          {knowledgeBases.map((knowledgeBase) => (
            <CreateKnowledgeBaseCard
              key={knowledgeBase.id}
              knowledgeBase={knowledgeBase}
              onCardClick={() => onKnowledgeBaseSelect(knowledgeBase)}
              setKnowledgeBases={setKnowledgeBases}
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
