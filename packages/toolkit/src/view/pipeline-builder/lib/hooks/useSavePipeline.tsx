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
import { isIteratorComponent } from "../checkComponentType";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  pipelineId: store.pipelineId,
  pipelineIsNew: store.pipelineIsNew,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  accessToken: store.accessToken,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updatePipelineIsNew: store.updatePipelineIsNew,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  isEditingIterator: store.isEditingIterator,
  editingIteratorID: store.editingIteratorID,
});

export type UseSavePipelineProps =
  | {
      setIsSaving?: (value: boolean) => void;
    }
  | undefined;

export function useSavePipeline(props: UseSavePipelineProps = {}) {
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
    tempSavedNodesForEditingIteratorFlow,
    isEditingIterator,
    editingIteratorID,
  } = useInstillStore(useShallow(selector));

  return React.useCallback(
    async function () {
      if (!pipelineId || !entity.isSuccess) {
        return;
      }

      if (props?.setIsSaving) {
        props.setIsSaving(true);
      }

      let targetNodes = nodes;

      if (isEditingIterator) {
        targetNodes = tempSavedNodesForEditingIteratorFlow.map((node) => {
          if (
            node.data.id === editingIteratorID &&
            isIteratorComponent(node.data)
          ) {
            const components = nodes.map((node) => node.data);

            return {
              ...node,
              data: {
                ...node.data,
                iterator_component: {
                  ...node.data.iterator_component,
                  components,
                },
                metadata: composePipelineMetadataFromNodes(nodes),
              },
            };
          }

          return node;
        });
      }

      if (!pipelineIsNew && pipelineRecipeIsDirty) {
        const payload: UpdateUserPipelinePayload = {
          name: entity.pipelineName,
          recipe: constructPipelineRecipe(targetNodes.map((node) => node.data)),
          metadata: composePipelineMetadataFromNodes(targetNodes),
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

        if (props?.setIsSaving) {
          props.setIsSaving(false);
        }

        return;
      }

      // If the user haven't created the pipeline yet, we will create the pipeline

      const payload: CreateUserPipelinePayload = {
        id: pipelineId,
        recipe: constructPipelineRecipe(targetNodes.map((node) => node.data)),
        metadata: composePipelineMetadataFromNodes(targetNodes),
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

      if (props?.setIsSaving) {
        props.setIsSaving(false);
      }
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
      props.setIsSaving,
      isEditingIterator,
      editingIteratorID,
      tempSavedNodesForEditingIteratorFlow,
    ]
  );
}
