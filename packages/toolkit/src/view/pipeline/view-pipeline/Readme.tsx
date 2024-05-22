"use client";

import {
  InstillStore,
  useInstillStore,
  useShallow,
  Nullable,
  useUpdateUserPipeline,
  UpdateUserPipelinePayload,
  sendAmplitudeData,
  useAmplitudeCtx,
  useAppEntity,
} from "../../../lib";
import { useToast } from "@instill-ai/design-system";
import { RealTimeTextEditor } from "../../../components";

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

  const entity = useAppEntity();

  const updateUserPipeline = useUpdateUserPipeline();

  const onUpdatePipelineReadme = async (readme: string) => {
    if (!entity.isSuccess || !accessToken || !entity.data.pipelineName) {
      return;
    }

    const payload: UpdateUserPipelinePayload = {
      name: entity.data.pipelineName,
      readme,
    };

    await updateUserPipeline.mutateAsync({ payload, accessToken });

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
      isReady={entity.isSuccess && !!accessToken && !!entity.data.pipelineName}
      isEditable={isEditable}
      content={readme}
    />
  );
};
