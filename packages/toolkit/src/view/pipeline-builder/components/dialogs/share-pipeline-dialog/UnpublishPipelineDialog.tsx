"use client";

import * as React from "react";
import {
  InstillNameInterpreter,
  UpdateNamespacePipelineRequest,
} from "instill-sdk";

import { Button, Dialog } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  sendAmplitudeData,
  toastInstillError,
  toastInstillSuccess,
  useAmplitudeCtx,
  useInstillStore,
  useNamespacePipeline,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
});

export const UnpublishPipelineDialog = ({
  pipelineName,
}: {
  pipelineName: Nullable<string>;
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [isOpen, setIsOpen] = React.useState(false);
  const { accessToken, enabledQuery, updateDialogSharePipelineIsOpen } =
    useInstillStore(useShallow(selector));

  const pipeline = useNamespacePipeline({
    namespaceId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).namespaceId
      : null,
    pipelineId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).resourceId
      : null,
    enabled: enabledQuery && !!pipelineName,
    accessToken,
    view: "VIEW_FULL",
    shareCode: null,
  });

  const updatePipeline = useUpdateNamespacePipeline();
  async function unPublishPipeline() {
    if (!pipeline.isSuccess || !pipelineName) return;

    const instillName = InstillNameInterpreter.pipeline(pipelineName);

    try {
      const payload: UpdateNamespacePipelineRequest = {
        namespaceId: instillName.namespaceId,
        pipelineId: instillName.resourceId,
        sharing: {
          ...pipeline.data.sharing,
          users: {
            "*/*": {
              enabled: false,
              role: "ROLE_EXECUTOR",
            },
          },
        },
      };

      await updatePipeline.mutateAsync({ ...payload, accessToken });

      if (amplitudeIsInit) {
        sendAmplitudeData("unpublish_pipeline");
      }

      toastInstillSuccess({
        title: "Pipeline successfully unpublished",
      });

      updateDialogSharePipelineIsOpen(() => false);
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when unpublishing pipeline",
        error,
      });
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="primary" size="lg">
          Unpublish
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="!w-[496px]">
        <div className="flex w-full flex-col gap-y-6">
          <div className="mx-auto h-12 w-12 shrink-0 grow-0 rounded-full bg-semantic-warning-bg"></div>
          <div className="flex flex-col gap-y-1">
            <h3 className="text-center text-semantic-fg-primary product-headings-heading-3">
              Unpublish Confirmation
            </h3>
            <p className="text-center text-semantic-fg-secondary product-body-text-2-regular">
              You are on the brink of unpublishing a pipeline. This action will
              make it become inaccessible to other users. Please ensure this is
              the exact manoeuvre you want to perform. It’s always a great idea
              to backup data before you proceed. Keep in mind that although
              you’re unpublishing, it doesn’t delete any data. The pipeline’s
              configuration and history will still be intact.
            </p>
          </div>
          <div className="flex flex-row gap-x-6">
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              type="button"
              variant="secondaryGrey"
              className="flex-1"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await unPublishPipeline();
              }}
              type="button"
              variant="danger"
              className="flex-1"
              size="lg"
            >
              Unpublish
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
