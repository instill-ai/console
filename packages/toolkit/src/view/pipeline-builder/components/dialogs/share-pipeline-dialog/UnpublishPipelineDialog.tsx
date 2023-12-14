import * as React from "react";
import { Button, Dialog, useToast } from "@instill-ai/design-system";
import {
  InstillStore,
  UpdateUserPipelinePayload,
  toastInstillError,
  useEntity,
  useInstillStore,
  useShallow,
  useUpdateUserPipeline,
  useUserPipeline,
} from "../../../../../lib";
import { useRouter } from "next/router";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
});

export const UnpublishPipelineDialog = () => {
  const router = useRouter();
  const { id, entity } = router.query;
  const [isOpen, setIsOpen] = React.useState(false);
  const { accessToken, enabledQuery, updateDialogSharePipelineIsOpen } =
    useInstillStore(useShallow(selector));
  const { toast } = useToast();

  const entirtyObject = useEntity();

  const pipeline = useUserPipeline({
    pipelineName: entirtyObject.pipelineName,
    enabled: enabledQuery && entirtyObject.isSuccess,
    accessToken,
  });

  const updateUserPipeline = useUpdateUserPipeline();
  async function unPublishPipeline() {
    if (!pipeline.isSuccess || !entirtyObject.isSuccess) return;

    try {
      const payload: UpdateUserPipelinePayload = {
        name: entirtyObject.pipelineName,
        permission: {
          ...pipeline.data.permission,
          users: {
            "*/*": {
              enabled: false,
              role: "ROLE_EXECUTOR",
            },
          },
        },
      };

      await updateUserPipeline.mutateAsync({ payload, accessToken });

      toast({
        title: "Pipeline successfully unpublished",
        variant: "alert-success",
        size: "small",
      });

      updateDialogSharePipelineIsOpen(() => false);
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when unpublishing pipeline",
        error,
        toast,
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
