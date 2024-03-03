import * as React from "react";
import {
  CreateUserPipelinePayload,
  InstillStore,
  UpdateUserPipelinePayload,
  getInstillApiErrorMessage,
  sendAmplitudeData,
  useAmplitudeCtx,
  useCreateUserPipeline,
  useEntity,
  useInstillStore,
  useShallow,
  useUpdateUserPipeline,
} from "../../../../lib";
import { composePipelineMetadataFromNodes, constructPipelineRecipe } from "..";
import { useToast } from "@instill-ai/design-system";
import { isAxiosError } from "axios";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  pipelineId: store.pipelineId,
  pipelineIsNew: store.pipelineIsNew,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  accessToken: store.accessToken,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updatePipelineIsNew: store.updatePipelineIsNew,
});

export const useHandleSavePipeline = ({
  setIsSaving,
}: {
  setIsSaving: (value: boolean) => void;
}) => {
  const entity = useEntity();
  const { toast } = useToast();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const updateUserPipeline = useUpdateUserPipeline();
  const createUserPipeline = useCreateUserPipeline();

  const {
    nodes,
    pipelineId,
    pipelineIsNew,
    pipelineRecipeIsDirty,
    accessToken,
    updatePipelineRecipeIsDirty,
    updatePipelineIsNew,
  } = useInstillStore(useShallow(selector));

  return React.useCallback(
    async function () {
      if (!pipelineId || !entity.isSuccess) {
        return;
      }

      setIsSaving(true);

      if (!pipelineIsNew && pipelineRecipeIsDirty) {
        const payload: UpdateUserPipelinePayload = {
          name: entity.pipelineName,
          recipe: constructPipelineRecipe(nodes),
          metadata: composePipelineMetadataFromNodes(nodes),
        };

        try {
          await updateUserPipeline.mutateAsync({
            payload,
            accessToken,
          });

          if (amplitudeIsInit) {
            sendAmplitudeData("update_pipeline_recipe");
          }

          toast({
            title: "Pipeline is saved",
            variant: "alert-success",
            size: "small",
          });

          updatePipelineRecipeIsDirty(() => false);
        } catch (error) {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when save the pipeline",
              description: getInstillApiErrorMessage(error),
              variant: "alert-error",
              size: "large",
            });
          } else {
            toast({
              title: "Something went wrong when save the pipeline",
              variant: "alert-error",
              size: "large",
            });
          }
        }
        setIsSaving(false);
        return;
      }

      // If the user haven't created the pipeline yet, we will create the pipeline

      const payload: CreateUserPipelinePayload = {
        id: pipelineId,
        recipe: constructPipelineRecipe(nodes),
        metadata: composePipelineMetadataFromNodes(nodes),
      };

      try {
        await createUserPipeline.mutateAsync({
          entityName: entity.entityName,
          payload,
          accessToken,
        });

        updatePipelineRecipeIsDirty(() => false);
        updatePipelineIsNew(() => false);

        if (amplitudeIsInit) {
          sendAmplitudeData("create_pipeline");
        }

        toast({
          title: "Successfully saved the pipeline",
          variant: "alert-success",
          size: "small",
        });
      } catch (error) {
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when save the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when save the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
      }

      setIsSaving(false);
    },
    [
      accessToken,
      amplitudeIsInit,
      createUserPipeline,
      entity,
      nodes,
      pipelineId,
      pipelineIsNew,
      pipelineRecipeIsDirty,
      toast,
      updatePipelineIsNew,
      updatePipelineRecipeIsDirty,
      updateUserPipeline,
      setIsSaving,
    ]
  );
};
