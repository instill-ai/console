"use client";

import * as React from "react";
import {
  InstillNameInterpreter,
  Model,
  UpdateNamespaceModelRequest,
} from "instill-sdk";

import { useToast } from "@instill-ai/design-system";

import { ReadmeEditor } from "../../../components";
import {
  InstillStore,
  sendAmplitudeData,
  useAmplitudeCtx,
  useInstillStore,
  useShallow,
  useUpdateNamespaceModel,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export type ModelReadmeProps = {
  model?: Model;
  onUpdate: () => void;
};

export const ModelReadme = ({ model, onUpdate }: ModelReadmeProps) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken } = useInstillStore(useShallow(selector));
  const { toast } = useToast();
  const canEdit = React.useMemo(() => {
    return !!accessToken && !!model?.permission.canEdit;
  }, [model, accessToken]);

  const updateNamespaceModel = useUpdateNamespaceModel();

  const onUpdateModelReadme = async (readme: string) => {
    if (!accessToken || !model) {
      return;
    }

    const { namespaceId } = InstillNameInterpreter.model(model.name);

    if (!namespaceId) {
      return;
    }

    const payload: UpdateNamespaceModelRequest = {
      namespaceId,
      modelId: model.id,
      readme,
    };

    await updateNamespaceModel.mutateAsync({
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

    onUpdate();

    return;
  };

  return (
    <ReadmeEditor
      readme={model?.readme}
      canEdit={canEdit}
      onUpdate={onUpdateModelReadme}
      placeholder={
        canEdit
          ? `You don't have a README. You can start creating one by clicking **Edit** icon in the top right corner.`
          : "There is no README for this model."
      }
      className="flex-1 flex flex-col [&>.markdown-body]:flex-1"
    />
  );
};
