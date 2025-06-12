"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CreateNamespacePipelineRequest,
  RenameNamespacePipelineRequest,
  UpdateNamespacePipelineRequest,
} from "instill-sdk";

import {
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  toastInstillSuccess,
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
        !routeInfo.data.namespaceId ||
        !routeInfo.data.resourceId ||
        !accessToken
      ) {
        return;
      }

      if (pipelineIsNew) {
        const payload: CreateNamespacePipelineRequest = {
          namespaceId: routeInfo.data.namespaceId,
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

          toastInstillSuccess({
            title: "Successfully saved the pipeline",
          });
        } catch (error) {
          toastInstillError({
            title: "Something went wrong when save the pipeline",
            error,
          });

          return Promise.reject(error);
        }

        return;
      }

      // If the pipeline recipe is dirty, we should update the pipeline recipe
      // first then rename the pipeline

      if (pipelineRecipeIsDirty) {
        const payload: UpdateNamespacePipelineRequest = {
          namespaceId: routeInfo.data.namespaceId,
          pipelineId: routeInfo.data.resourceId,
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
          toastInstillError({
            title: "Something went wrong when save the pipeline",
            error,
          });

          return Promise.reject(error);
        }
      }

      const payload: RenameNamespacePipelineRequest = {
        namespaceId: routeInfo.data.namespaceId,
        pipelineId: routeInfo.data.resourceId,
        newPipelineId: newId,
      };

      try {
        await renamePipeline.mutateAsync({
          payload: payload,
          accessToken,
        });

        router.push(`/${routeInfo.data.namespaceId}/pipelines/${newId}/editor`);

        toastInstillSuccess({
          title: "Sussessfully renamed the pipeline",
        });

        updatePipelineId(() => newId);
        updatePipelineName(
          () => `${routeInfo.data.namespaceName}/pipelines/${newId}`,
        );
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when rename the pipeline",
          error,
        });
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
      updatePipeline,
      updatePipelineId,
      updatePipelineIsNew,
      updatePipelineName,
      updatePipelineRecipeIsDirty,
    ],
  );
}
