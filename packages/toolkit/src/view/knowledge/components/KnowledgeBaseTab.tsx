import { Separator } from "@instill-ai/design-system";
import * as React from "react";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import { CreateKnowledgeBaseCard } from "./CreateKnowledgeBaseCard";
import { CreateKnowledgeDialog } from "./CreateKnowledgeDialog";
import { useGetKnowledgeBases } from "../../../lib/vdp-sdk/knowledge/useGetKnowledgeBases";
import { useCreateKnowledgeBase } from "../../../lib/vdp-sdk/knowledge/useCreateKnowledgeBase";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/knowledgeBase";
import { InstillStore, useAuthenticatedUser, useInstillStore, useShallow } from "../../../lib";

type KnowledgeBaseTabProps = {
    onKnowledgeBaseSelect: (knowledgeBase: KnowledgeBase) => void;
};


const mockKnowledgeBases: KnowledgeBase[] = [
    {
        id: "1",
        title: "Knowledge Base 1",
        description: "This is the first knowledge base.",
        tags: ["tag1", "tag2"],
    },
    {
        id: "2",
        title: "Knowledge Base 2",
        description: "This is the second knowledge base.",
        tags: ["tag3", "tag4"],
    },
    {
        id: "3",
        title: "Knowledge Base 3",
        description: "This is the third knowledge base.",
        tags: ["tag5", "tag6"],
    },
];




export const KnowledgeBaseTab = ({ onKnowledgeBaseSelect }: KnowledgeBaseTabProps) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [knowledgeBases, setKnowledgeBases] = React.useState<KnowledgeBase[]>([]);

    const getKnowledgeBases = useGetKnowledgeBases();
    const createKnowledgeBase = useCreateKnowledgeBase();

    const selector = (store: InstillStore) => ({
        accessToken: store.accessToken,
        enabledQuery: store.enabledQuery,
    });

    const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

    const me = useAuthenticatedUser({
        enabled: enabledQuery,
        accessToken,
    });

    const userID = me.isSuccess ? me.data.id : null;

    React.useEffect(() => {
        const fetchKnowledgeBases = async () => {
            const knowledgeBasesData = await getKnowledgeBases.mutateAsync({
                accessToken: null,
                uid: userID as string,
            });
            setKnowledgeBases(knowledgeBasesData);
        };

        fetchKnowledgeBases();
    }, []);

    const handleCreateKnowledgeSubmit = async (data: any) => {
        const newKnowledgeBase = await createKnowledgeBase.mutateAsync({
            payload: data,
            accessToken: null,
        });
        setKnowledgeBases([...knowledgeBases, newKnowledgeBase]);
        setIsCreateDialogOpen(false);
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                    Knowledge Base
                </p>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className="grid gap-16 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 xl:grid-cols-3">
                <KnowledgeBaseCard onClick={() => setIsCreateDialogOpen(true)} />
                {mockKnowledgeBases.map((knowledgeBase) => (
                    <CreateKnowledgeBaseCard
                        key={knowledgeBase.id}
                        knowledgeBase={knowledgeBase}
                        onCardClick={() => onKnowledgeBaseSelect(knowledgeBase)}
                    />
                ))}
            </div>
            <CreateKnowledgeDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateKnowledgeSubmit}
            />
        </div>
    );
};