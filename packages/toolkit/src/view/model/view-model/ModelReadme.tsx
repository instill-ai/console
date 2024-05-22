"use client";

import {
  InstillStore,
  useInstillStore,
  useShallow,
  sendAmplitudeData,
  useAmplitudeCtx,
  useUpdateUserModel,
  Model,
  UpdateUserModelPayload,
} from "../../../lib";
import { useToast } from "@instill-ai/design-system";
import { RealTimeTextEditor } from "../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const ModelReadme = ({ model }: { model?: Model }) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken } = useInstillStore(useShallow(selector));
  const { toast } = useToast();

  const updateUserModel = useUpdateUserModel();

  const onUpdateModelReadme = async (readme: string) => {
    if (!accessToken || !model) {
      return;
    }

    const payload: UpdateUserModelPayload = {
      readme,
    };

    await updateUserModel.mutateAsync({
      name: model.name,
      payload,
      accessToken,
    });

    if (amplitudeIsInit) {
      sendAmplitudeData("update_model_readme");
    }

    toast({
      size: "small",
      title: "Model readme updated successfully",
      variant: "alert-success",
    });

    return;
  };

  return (
    <RealTimeTextEditor
      isReady={!!model && !!accessToken}
      isEditable={!!model?.permission.can_edit}
      content={model?.readme || null}
      onSave={onUpdateModelReadme}
    />
  );
};
