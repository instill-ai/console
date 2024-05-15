"use client";

import Image from "next/image";
import { Menu } from "./Menu";
import { Tags } from "./Tags";
import { Stats } from "./Stats";
import {
  Model,
  Nullable,
  sendAmplitudeData,
  useAmplitudeCtx,
  useDeleteModel,
} from "../../lib";
import React from "react";
import {
  useToast,
  getModelHardwareToolkit,
  getModelRegionToolkit,
} from "@instill-ai/design-system";
import axios from "axios";
import { useParams } from "next/navigation";

export type CardModelProps = {
  model: Model;
  accessToken: Nullable<string>;
  onDelete: () => void;
};

export const CardModel = (props: CardModelProps) => {
  const { model, accessToken, onDelete } = props;
  const params = useParams();
  const entity = params.entity ? String(params.entity) : null;
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { toast } = useToast();

  /* -------------------------------------------------------------------------
   * Handle delete model
   * -----------------------------------------------------------------------*/

  const deleteModel = useDeleteModel();
  const handleDeleteModel = React.useCallback(async () => {
    if (!model) return;

    try {
      await deleteModel.mutateAsync({ modelName: model.name, accessToken });

      if (amplitudeIsInit) {
        sendAmplitudeData("delete_model");
      }

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      const isAxiosError = axios.isAxiosError(error);
      const message = isAxiosError
        ? `${error.response?.status} - ${error.response?.data.message}`
        : "Something went wrong when deleting the model";

      toast({
        title: "Delete model error",
        variant: "alert-error",
        size: "large",
        description: message,
      });
    }
  }, [model, amplitudeIsInit, deleteModel, onDelete, accessToken, toast]);

  return (
    <div className="flex flex-row gap-x-6 rounded-md border border-semantic-bg-line bg-white p-4">
      <Image
        className="shrink-0 rounded"
        src="/images/models/model-placeholder.svg"
        alt="model image"
        width={156}
        height={156}
      />
      <div className="flex grow flex-col gap-y-2">
        <div className="flex w-full flex-row items-start gap-x-2">
          <a
            href={`/${entity}/models/${model.id}`}
            className="break-all font-medium text-semantic-accent-default hover:!underline"
          >
            {model.id}
          </a>
          <Tags
            isPrivate={model.visibility === "VISIBILITY_PRIVATE"}
            region={getModelRegionToolkit(model.region) || ""}
            hardware={getModelHardwareToolkit(model.hardware) || ""}
          />
          <Menu handleDeleteModel={handleDeleteModel} model={model} />
        </div>
        <p className="text-semantic-fg-secondary">{model.description}</p>
        <Stats
          task={model.task}
          updatedAt={model.update_time || model.create_time}
        />
      </div>
    </div>
  );
};
