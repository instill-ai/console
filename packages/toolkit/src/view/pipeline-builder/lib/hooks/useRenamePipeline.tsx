import * as React from "react";
import {
  CreateUserPipelinePayload,
  InstillStore,
  RenameUserPipelinePayload,
  UpdateUserPipelinePayload,
  getInstillApiErrorMessage,
  sendAmplitudeData,
  useAmplitudeCtx,
  useRouteInfo,
  useCreateUserPipeline,
  useInstillStore,
  useRenameUserPipeline,
  useShallow,
  useUpdateUserPipeline,
} from "../../../../lib";
import { composePipelineRecipeFromNodes } from "../composePipelineRecipeFromNodes";
import { composePipelineMetadataMapFromNodes } from "../composePipelineMetadataMapFromNodes";
import { useToast } from "@instill-ai/design-system";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  pipelineId: store.pipelineId,
  updatePipelineId: store.updatePipelineId,
  updatePipelineName: store.updatePipelineName,
  pipelineIsNew: store.pipelineIsNew,
  updatePipelineIsNew: store.updatePipelineIsNew,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  accessToken: store.accessToken,
});

export function useRenamePipeline() {
  const routeInfo = useRouteInfo();
  const router = useRouter();
  const { toast } = useToast();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const {
    nodes,
    pipelineId,
    updatePipelineId,
    updatePipelineName,
    pipelineIsNew,
    updatePipelineIsNew,
    pipelineRecipeIsDirty,
    updatePipelineRecipeIsDirty,
    accessToken,
  } = useInstillStore(useShallow(selector));

  const createUserPipeline = useCreateUserPipeline();
  const updateUserPipeline = useUpdateUserPipeline();
  const renameUserPipeline = useRenameUserPipeline();
  return React.useCallback(
    async function handleRenamePipeline(newId: string) {
      if (
        !pipelineId ||
        !routeInfo.isSuccess ||
        !routeInfo.data.namespaceName ||
        !routeInfo.data.pipelineName ||
        !accessToken
      ) {
        return;
      }

      if (pipelineIsNew) {
        const payload: CreateUserPipelinePayload = {
          id: newId,
          recipe: composePipelineRecipeFromNodes(nodes),
          metadata: composePipelineMetadataMapFromNodes(nodes),
        };

        try {
          const res = await createUserPipeline.mutateAsync({
            entityName: routeInfo.data.namespaceName,
            payload,
            accessToken,
          });

          // We should change all the state before pushing to the new route

          updatePipelineId(() => newId);
          updatePipelineName(() => res.pipeline.name);
          updatePipelineIsNew(() => false);
          updatePipelineRecipeIsDirty(() => false);

          if (amplitudeIsInit) {
            sendAmplitudeData("create_pipeline");
          }

          router.push(
            `/${routeInfo.data.namespaceId}/pipelines/${newId}/editor`
          );

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

          return Promise.reject(error);
        }

        return;
      }

      // If the pipeline recipe is dirty, we should update the pipeline recipe
      // first then rename the pipeline

      if (pipelineRecipeIsDirty) {
        const payload: UpdateUserPipelinePayload = {
          name: routeInfo.data.pipelineName,
          recipe: composePipelineRecipeFromNodes(nodes),
          metadata: composePipelineMetadataMapFromNodes(nodes),
        };

        try {
          await updateUserPipeline.mutateAsync({
            payload,
            accessToken,
          });

          if (amplitudeIsInit) {
            sendAmplitudeData("update_pipeline_name");
          }

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
          return Promise.reject(error);
        }
      }

      const payload: RenameUserPipelinePayload = {
        name: routeInfo.data.pipelineName,
        new_pipeline_id: newId,
      };

      try {
        await renameUserPipeline.mutateAsync({
          payload: payload,
          accessToken,
        });

        router.push(`/${routeInfo.data.namespaceId}/pipelines/${newId}/editor`);

        toast({
          title: "Sussessfully renamed the pipeline",
          variant: "alert-success",
          size: "small",
        });

        updatePipelineId(() => newId);
        updatePipelineName(
          () => `${routeInfo.data.namespaceName}/pipelines/${newId}`
        );
      } catch (error) {
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when rename the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when rename the pipeline",
            variant: "alert-error",
            description: "Please try again later",
            size: "large",
          });
        }

        return Promise.reject(error);
      }
    },
    [
      accessToken,
      amplitudeIsInit,
      createUserPipeline,
      routeInfo.isSuccess,
      routeInfo.data,
      nodes,
      pipelineId,
      pipelineIsNew,
      pipelineRecipeIsDirty,
      renameUserPipeline,
      router,
      toast,
      updateUserPipeline,
      updatePipelineId,
      updatePipelineIsNew,
      updatePipelineName,
      updatePipelineRecipeIsDirty,
    ]
  );
}
