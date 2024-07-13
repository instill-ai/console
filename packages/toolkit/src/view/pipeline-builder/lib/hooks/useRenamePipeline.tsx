import * as React from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  CreateNamespacePipelineRequest,
  RenameNamespacePipelineRequest,
  UpdateNamespacePipelineRequest,
} from "instill-sdk";

import { useToast } from "@instill-ai/design-system";

import {
  getInstillApiErrorMessage,
  InstillStore,
  sendAmplitudeData,
  useAmplitudeCtx,
  useCreateNamespacePipeline,
  useInstillStore,
  useRenameNamespacePipeline,
  useRouteInfo,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../../../lib";
import { composePipelineMetadataMapFromNodes } from "../composePipelineMetadataMapFromNodes";
import { composePipelineRecipeFromNodes } from "../composePipelineRecipeFromNodes";

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

  const createPipeline = useCreateNamespacePipeline();
  const updatePipeline = useUpdateNamespacePipeline();
  const renamePipeline = useRenameNamespacePipeline();
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
        const payload: CreateNamespacePipelineRequest = {
          namespaceName: routeInfo.data.namespaceName,
          id: newId,
          recipe: composePipelineRecipeFromNodes(nodes),
          metadata: composePipelineMetadataMapFromNodes(nodes),
        };

        try {
          const res = await createPipeline.mutateAsync({
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
            `/${routeInfo.data.namespaceId}/pipelines/${newId}/editor`,
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
        const payload: UpdateNamespacePipelineRequest = {
          namespacePipelineName: routeInfo.data.pipelineName,
          recipe: composePipelineRecipeFromNodes(nodes),
          metadata: composePipelineMetadataMapFromNodes(nodes),
        };

        try {
          await updatePipeline.mutateAsync({
            ...payload,
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

      const payload: RenameNamespacePipelineRequest = {
        namespacePipelineName: routeInfo.data.pipelineName,
        newPipelineId: newId,
      };

      try {
        await renamePipeline.mutateAsync({
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
          () => `${routeInfo.data.namespaceName}/pipelines/${newId}`,
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
      createPipeline,
      routeInfo.isSuccess,
      routeInfo.data,
      nodes,
      pipelineId,
      pipelineIsNew,
      pipelineRecipeIsDirty,
      renamePipeline,
      router,
      toast,
      updatePipeline,
      updatePipelineId,
      updatePipelineIsNew,
      updatePipelineName,
      updatePipelineRecipeIsDirty,
    ],
  );
}
