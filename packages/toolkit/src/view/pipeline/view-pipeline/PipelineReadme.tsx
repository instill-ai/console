"use client";

import type { Pipeline } from "instill-sdk";
import * as React from "react";
import { InstillNameInterpreter } from "instill-sdk";

import { ReadmeEditor } from "../../../components";
import {
  InstillStore,
  sendAmplitudeData,
  toastInstillSuccess,
  useAmplitudeCtx,
  useInstillStore,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export type PipelineReadmeProps = {
  pipeline?: Pipeline;
  onUpdate: () => void;
};

export const PipelineReadme = ({ pipeline, onUpdate }: PipelineReadmeProps) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken } = useInstillStore(useShallow(selector));
  const canEdit = React.useMemo(() => {
    return !!accessToken && !!pipeline?.permission.canEdit;
  }, [pipeline, accessToken]);

  const updatePipeline = useUpdateNamespacePipeline();

  const onUpdatePipelineReadme = async (readme: string) => {
    if (!accessToken || !pipeline) {
      return;
    }

    const instillName = InstillNameInterpreter.pipeline(pipeline.name);

    await updatePipeline.mutateAsync({
      namespaceId: instillName.namespaceId,
      pipelineId: instillName.resourceId,
      readme,
      accessToken,
    });

    if (amplitudeIsInit) {
      sendAmplitudeData("update_pipeline_readme");
    }

    toastInstillSuccess({
      title: "Pipeline readme updated successfully",
    });

    onUpdate();

    return;
  };

  return (
    <ReadmeEditor
      readme={pipeline?.readme}
      canEdit={canEdit}
      onUpdate={onUpdatePipelineReadme}
      placeholder={
        canEdit
          ? `You don't have a README. You can start creating one by clicking **Edit** icon in the top right corner.`
          : "There is no README for this pipeline."
      }
      className="flex-1 flex flex-col"
    />
  );
};
