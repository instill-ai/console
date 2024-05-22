// KnowledgeBaseView.tsx
"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Button, Icons, Separator, Collapsible, ScrollArea, TabMenu, Form, Field, Label, Input, Textarea, Dialog } from "@instill-ai/design-system";
import { GeneralAppPageProp, useModels, useWatchUserModels } from "../../lib";
import { Sidebar } from "./components/Sidebar";
import { KnowledgeBaseCard } from "./components/KnowledgeBaseCard";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from 'react'

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

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/
  return (
    <div className="min-h-screen bg-semantic-bg-primary">
      <div className="container mx-auto mt-8 grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-9">
          <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                Knowledge Base
              </h1>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className="grid grid-cols-3 gap-6">
              <KnowledgeBaseCard
                title="Create Knowledge"
                description="Import your own text data or write data in real-time via Webhook for LLM context enhancement."
                onClick={() => setIsCreateDialogOpen(true)}
              />
              <KnowledgeBaseCard
                title="Knowledge Base 1"
                description="Enhance your LLM context with ease by importing your own text data or writing in real-time via Webhook. Build a comprehensive knowledge base effortlessly."
                tags={["Tags"]}
              />
              <KnowledgeBaseCard
                title="Knowledge Base 2"
                description="Enhance your LLM context with ease by importing your own text data or writing in real-time via Webhook. Build a comprehensive knowledge base effortlessly."
                tags={["Tags"]}
              />
              <KnowledgeBaseCard
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

const CreateKnowledgeDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: CreateKnowledgeFormProps["onSubmit"];
}) => {
  const form = useForm<z.infer<typeof CreateKnowledgeFormSchema>>({
    resolver: zodResolver(CreateKnowledgeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
    },
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content noBlur className="fixed inset-0 flex items-center justify-center">
        <div className="mx-auto flex w-[450px] flex-col rounded bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            Create Knowledge
          </Dialog.Title>
          <Form.Root
            {...form}
          >
            <form
              className="flex flex-col space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Form.Field
                control={form.control}
                name="title"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label htmlFor={field.name}>Title</Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          id={field.name}
                          placeholder="Enter title"
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label htmlFor={field.name}>Description</Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          id={field.name}
                          placeholder="Enter description"
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label htmlFor={field.name}>Tags</Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          id={field.name}
                          placeholder="Enter tags"
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <div className="mt-6 flex justify-end space-x-4">
                <Button variant="secondaryColour" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Form.Root>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};