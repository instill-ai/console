// KnowledgeBaseView.tsx
"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Button, Icons, Separator } from "@instill-ai/design-system";
import { GeneralAppPageProp, useModels, useWatchUserModels } from "../../lib";
import { Sidebar } from "./components/Sidebar";
import { KnowledgeBaseCard } from "./components/KnowledgeBaseCard";
import { CreateKnowledgeDialog } from "./components/CreateKnowledgeDialog";
import * as z from "zod";
import * as React from "react";
import { CreateKnowledgeBaseCard } from "./components/CreateKnowledgeBaseCard";
import { KnowledgeBase } from "../../lib/vdp-sdk/knowledge/knowledgeBase";
import { useCreateKnowledgeBase } from "../../lib/vdp-sdk/knowledge/useCreateKnowledgeBase";
import { useGetKnowledgeBases } from "../../lib/vdp-sdk/knowledge/useGetKnowledgeBases";
import { useUpdateKnowledgeBase } from "../../lib/vdp-sdk/knowledge/useUpdateKnowledgeBase";
import { useDeleteKnowledgeBase } from "../../lib/vdp-sdk/knowledge/useDeleteKnowledgeBase";

export type KnowledgeBaseViewProps = GeneralAppPageProp;

const CreateKnowledgeFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tags: z.string().optional(),
});

type CreateKnowledgeFormProps = {
  onSubmit: (data: z.infer<typeof CreateKnowledgeFormSchema>) => void;
};

export const KnowledgeBaseView = (props: KnowledgeBaseViewProps) => {
  const { router, enableQuery, accessToken } = props;
  const { entity } = useParams();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const createKnowledgeBase = useCreateKnowledgeBase();
  const getKnowledgeBases = useGetKnowledgeBases();
  const updateKnowledgeBase = useUpdateKnowledgeBase();
  const deleteKnowledgeBase = useDeleteKnowledgeBase();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/
  const models = useModels({
    enabled: enableQuery,
    accessToken,
  });

  const modelsWatchState = useWatchUserModels({
    modelNames: models.isSuccess ? models.data.map((p) => p.name) : [],
    enabled: enableQuery && models.isSuccess && models.data.length > 0,
    accessToken,
  });

  const handleCreateKnowledgeSubmit: CreateKnowledgeFormProps["onSubmit"] = (data) => {
    console.log("Create Knowledge submitted:", data);
    // Perform the necessary actions with the form data (e.g., API call, state update, etc.)
    setIsCreateDialogOpen(false);
  };

  const isLoadingResource =
    models.isLoading || (models.isSuccess && models.data.length > 0)
      ? modelsWatchState.isLoading
      : false;

  const [knowledgeBases, setKnowledgeBases] = React.useState<KnowledgeBase[]>([]);

  React.useEffect(() => {
    const fetchKnowledgeBases = async () => {
      const knowledgeBasesData = await getKnowledgeBases();
      setKnowledgeBases(knowledgeBasesData);
    };

    fetchKnowledgeBases();
  }, []);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/
  return (
    <div className="w-full h-screen bg-semantic-bg-primary">
      <div className="grid w-full grid-cols-12 gap-6 pl-4 pr-8 pt-6">
        <div className="lg:col-span-2 md:col-span-3 sm:col-span-4 pt-18 pr-8">
          <Sidebar />
        </div>
        <div className="lg:col-span-10 md:col-span-9 sm:col-span-8">
          <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                Knowledge Base
              </p>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className="grid gap-16 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4">
              <KnowledgeBaseCard
                onClick={() => setIsCreateDialogOpen(true)}
              />
              <CreateKnowledgeBaseCard
                title="Knowledge Base 1"
                description="Enhance your LLM context with ease by importing your own text data or writing in real-time via Webhook. Build a comprehensive knowledge base effortlessly."
                tags={["Tags"]}
              />
              <CreateKnowledgeBaseCard
                title="Knowledge Base 2"
                description="Enhance your LLM context with ease by importing your own text data or writing in real-time via Webhook. Build a comprehensive knowledge base effortlessly."
                tags={["Tags"]}
              />
              <CreateKnowledgeBaseCard
                title="Knowledge Base 3"
                description="Enhance your LLM context with ease by importing your own text data or writing in real-time via Webhook. Build a comprehensive knowledge base effortlessly."
                tags={["Text improvements for LLM", "another tag", "+3"]}
              />
            </div>
          </div>
        </div>
      </div>
      <CreateKnowledgeDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateKnowledgeSubmit}
      />
    </div>
  );
};