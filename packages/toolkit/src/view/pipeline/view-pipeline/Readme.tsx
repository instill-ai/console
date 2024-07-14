"use client";

import { useToast } from "@instill-ai/design-system";

import type { InstillStore, Nullable } from "../../../lib";
import { RealTimeTextEditor } from "../../../components";
import {
  sendAmplitudeData,
  useAmplitudeCtx,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const Readme = ({
  isEditable,
  readme,
}: {
  isEditable: boolean;
  readme: Nullable<string>;
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken } = useInstillStore(useShallow(selector));
  const { toast } = useToast();

  const routeInfo = useRouteInfo();

  const updatePipeline = useUpdateNamespacePipeline();

  const onUpdatePipelineReadme = async (readme: string) => {
    if (!routeInfo.isSuccess || !accessToken || !routeInfo.data.pipelineName) {
      return;
    }

    await updatePipeline.mutateAsync({
      namespacePipelineName: routeInfo.data.pipelineName,
      readme,
      accessToken,
    });

    if (amplitudeIsInit) {
      sendAmplitudeData("update_pipeline_readme");
    }

    toast({
      size: "small",
      title: "Update pipeline readme successfully",
      variant: "alert-success",
    });

    return;
  };

  return (
    <RealTimeTextEditor
      onSave={onUpdatePipelineReadme}
      isReady={
        routeInfo.isSuccess && !!accessToken && !!routeInfo.data.pipelineName
      }
      isEditable={isEditable}
      content={readme}
    />
  );
};
