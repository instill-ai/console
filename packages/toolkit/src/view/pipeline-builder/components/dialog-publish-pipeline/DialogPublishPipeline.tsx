import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { isAxiosError } from "axios";
import {
  Dialog,
  Form,
  LinkButton,
  Toast,
  useToast,
} from "@instill-ai/design-system";

import {
  InstillStore,
  UpdateUserPipelinePayload,
  useInstillStore,
  useUpdateUserPipeline,
  useUserPipeline,
} from "../../../../lib";
import { Head } from "./Head";
import { Metadata } from "./Metadata";
import { ReadmeEditor } from "./ReadmeEditor";
import { useRouter } from "next/router";

const selector = (store: InstillStore) => ({
  pipelineName: store.pipelineName,
  nodes: store.nodes,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  dialogPublishPipelineIsOpen: store.dialogPublishPipelineIsOpen,
  updateDialogPublishPipelineIsOpen: store.updateDialogPublishPipelineIsOpen,
  pipelineIsNew: store.pipelineIsNew,
});

export const PublishPipelineFormSchema = z.object({
  description: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  license: z.string().optional().nullable(),
});

export const DialogPublishPipeline = () => {
  const [isPublishing, setIsPublishing] = React.useState(false);

  const { toast } = useToast();

  const {
    pipelineName,
    nodes,
    accessToken,
    enabledQuery,
    dialogPublishPipelineIsOpen,
    updateDialogPublishPipelineIsOpen,
    pipelineIsNew,
  } = useInstillStore(useShallow(selector));

  const form = useForm<z.infer<typeof PublishPipelineFormSchema>>({
    resolver: zodResolver(PublishPipelineFormSchema),
  });

  const router = useRouter();
  const { id, entity } = router.query;

  const pipeline = useUserPipeline({
    pipelineName: `users/${entity}/pipelines/${id}`,
    accessToken,
    enabled: enabledQuery && !!accessToken && !pipelineIsNew,
  });

  const updateUserPipeline = useUpdateUserPipeline();

  async function handlePublish(
    formData: z.infer<typeof PublishPipelineFormSchema>
  ) {
    if (!pipelineName || isPublishing || !pipeline.isSuccess) return;

    setIsPublishing(true);

    const payload: UpdateUserPipelinePayload = {
      name: pipelineName,
      description: formData.description ?? undefined,
      permission: {
        users: {
          ...pipeline.data.permission.users,
          "users/*": {
            enabled: true,
            role: "ROLE_EXECUTOR",
          },
        },
        share_code: pipeline.data?.permission.share_code ?? null,
      },
      metadata: {
        license: formData.license ?? undefined,
      },
    };

    try {
      await updateUserPipeline.mutateAsync({
        payload,
        accessToken,
      });
      setIsPublishing(false);

      toast({
        size: "large",
        title: "Pipeline published successfully!",
        description:
          "Hooray! Your pipeline has been successfully published to the hub and is now available to our ever-growing community. Keep up the good work! 🎉🚀",
        variant: "alert-success",
        action: (
          <Toast.Action className="flex w-full" altText="GoToPipeline" asChild>
            <LinkButton
              onClick={() => {
                router.push(`/${entity}/pipelines/${id}`);
              }}
              variant="primary"
              size="sm"
            >
              Check Your Pipeline Here
            </LinkButton>
          </Toast.Action>
        ),
      });
    } catch (err) {
      setIsPublishing(false);
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
      <Dialog.Content className="!bottom-0 !h-[calc(100vh-var(--topbar-height))] !w-screen !max-w-none !px-0 !py-6">
        <Form.Root {...form}>
          <form onSubmit={form.handleSubmit(handlePublish)}>
            <div className="flex h-full flex-col">
              <Head />
              <Metadata form={form} />
              <ReadmeEditor form={form} />
            </div>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
