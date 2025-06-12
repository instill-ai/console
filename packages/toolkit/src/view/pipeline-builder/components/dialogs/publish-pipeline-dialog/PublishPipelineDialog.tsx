"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateNamespacePipelineRequest } from "instill-sdk";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useShallow } from "zustand/react/shallow";

import { Dialog, Form } from "@instill-ai/design-system";

import {
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  toastInstillSuccess,
  useAmplitudeCtx,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useUpdateNamespacePipeline,
} from "../../../../../lib";
import { Head } from "./Head";
import { Metadata } from "./Metadata";
import { ReadmeEditor } from "./ReadmeEditor";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  dialogPublishPipelineIsOpen: store.dialogPublishPipelineIsOpen,
  updateDialogPublishPipelineIsOpen: store.updateDialogPublishPipelineIsOpen,
  pipelineIsNew: store.pipelineIsNew,
});

export const PublishPipelineFormSchema = z.object({
  description: z.string().optional().nullable(),
  readme: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  license: z.string().optional().nullable(),
});

export const PublishPipelineDialog = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [isPublishing, setIsPublishing] = React.useState(false);
  const routeInfo = useRouteInfo();

  const {
    accessToken,
    enabledQuery,
    dialogPublishPipelineIsOpen,
    updateDialogPublishPipelineIsOpen,
    pipelineIsNew,
  } = useInstillStore(useShallow(selector));

  const form = useForm<z.infer<typeof PublishPipelineFormSchema>>({
    resolver: zodResolver(PublishPipelineFormSchema),
  });

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess && !pipelineIsNew,
    view: "VIEW_FULL",
    shareCode: null,
  });

  const updatePipeline = useUpdateNamespacePipeline();

  async function handlePublish(
    formData: z.infer<typeof PublishPipelineFormSchema>,
  ) {
    if (
      isPublishing ||
      !pipeline.isSuccess ||
      !routeInfo.isSuccess ||
      !routeInfo.data.namespaceId ||
      !routeInfo.data.resourceId
    ) {
      return;
    }

    setIsPublishing(true);

    const payload: UpdateNamespacePipelineRequest = {
      namespaceId: routeInfo.data.namespaceId,
      pipelineId: routeInfo.data.resourceId,
      description: formData.description ?? undefined,
      readme: formData.readme ?? undefined,
      sharing: {
        users: {
          ...pipeline.data.sharing.users,
          "*/*": {
            enabled: true,
            role: "ROLE_EXECUTOR",
          },
        },
        shareCode: pipeline.data?.sharing.shareCode ?? null,
      },
      metadata: {
        license: formData.license ?? undefined,
      },
    };

    try {
      await updatePipeline.mutateAsync({
        ...payload,
        accessToken,
      });

      setIsPublishing(false);

      if (amplitudeIsInit) {
        sendAmplitudeData("publish_pipeline");
      }

      toastInstillSuccess({
        title: "Pipeline published successfully!",
        action: {
          label: "Check Your Pipeline Here",
          onClick: () => {
            router.push(
              `/${routeInfo.data.namespaceId}/pipelines/${routeInfo.data.resourceId}/playground`,
            );
          },
        },
        description:
          "Hooray! Your pipeline has been successfully published to the hub and is now available to our ever-growing community. Keep up the good work! 🎉🚀",
      });

      updateDialogPublishPipelineIsOpen(() => false);
    } catch (err) {
      setIsPublishing(false);
      updateDialogPublishPipelineIsOpen(() => false);
      toastInstillError({
        title: "Something went wrong when publish the pipeline",
        error: err,
      });
      console.error(err);
    }
  }

  return (
    <Dialog.Root
      open={dialogPublishPipelineIsOpen}
      onOpenChange={(e) => {
        form.reset({
          description: null,
        });
        updateDialogPublishPipelineIsOpen(() => e);
      }}
    >
      <Dialog.Content className="!bottom-0 !h-[calc(100vh-var(--topbar-controller-height))] !w-screen !max-w-none !px-0 !py-6">
        <Form.Root {...form}>
          <form onSubmit={form.handleSubmit(handlePublish)}>
            <div className="flex h-full flex-col">
              <Head
                entity={routeInfo.data.namespaceId}
                id={routeInfo.data.resourceId}
              />
              <Metadata
                form={form}
                description={
                  pipeline.isSuccess ? pipeline.data.description : null
                }
              />
              <ReadmeEditor
                form={form}
                readme={pipeline.isSuccess ? pipeline.data.readme : null}
              />
            </div>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
