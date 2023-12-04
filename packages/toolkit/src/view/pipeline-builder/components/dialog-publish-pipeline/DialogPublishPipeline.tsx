import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { isAxiosError } from "axios";
import { Dialog, useToast } from "@instill-ai/design-system";

import {
  CreateUserPipelineReleasePayload,
  InstillStore,
  getInstillApiErrorMessage,
  useCreateUserPipelineRelease,
  useInstillStore,
} from "../../../../lib";
import { constructPipelineRecipe } from "../../lib";
import { Head } from "./Head";

const selector = (store: InstillStore) => ({
  pipelineName: store.pipelineName,
  nodes: store.nodes,
  accessToken: store.accessToken,
  dialogPublishPipelineIsOpen: store.dialogPublishPipelineIsOpen,
  updateDialogPublishPipelineIsOpen: store.updateDialogPublishPipelineIsOpen,
});

export const ReleasePipelineFormSchema = z.object({
  id: z.string().min(1, { message: "Release Name is required" }),
  description: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  license: z.string().optional().nullable(),
});

export const DialogPublishPipeline = () => {
  const [isReleasing, setIsReleasing] = React.useState(false);

  const { toast } = useToast();

  const {
    pipelineName,
    nodes,
    accessToken,
    dialogPublishPipelineIsOpen,
    updateDialogPublishPipelineIsOpen,
  } = useInstillStore(useShallow(selector));

  const form = useForm<z.infer<typeof ReleasePipelineFormSchema>>({
    resolver: zodResolver(ReleasePipelineFormSchema),
  });

  const releasePipelineVersion = useCreateUserPipelineRelease();

  function onSubmit(formData: z.infer<typeof ReleasePipelineFormSchema>) {
    if (!pipelineName || isReleasing) return;

    setIsReleasing(true);

    const payload: CreateUserPipelineReleasePayload = {
      id: formData.id,
      description: formData.description ?? undefined,
      recipe: constructPipelineRecipe(nodes),
    };

    releasePipelineVersion.mutate(
      {
        pipelineName,
        payload,
        accessToken,
      },
      {
        onSuccess: () => {
          form.reset({
            id: "",
            description: null,
          });

          toast({
            title: "Successfully release pipeline",
            variant: "alert-success",
            size: "small",
          });

          updateDialogPublishPipelineIsOpen(() => false);
          setIsReleasing(false);
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when release pipeline",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when release pipeline",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }
          setIsReleasing(false);
        },
      }
    );
  }

  return (
    <Dialog.Root
      open={dialogPublishPipelineIsOpen}
      onOpenChange={(e) => {
        form.reset({
          id: "",
          description: null,
        });
        updateDialogPublishPipelineIsOpen(() => e);
      }}
    >
      <Dialog.Content className="!h-[calc(100vh-var(--topbar-height))] !w-[screen] !px-0 !py-6">
        <div className="flex flex-col">
          <Head />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
