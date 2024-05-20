"use client";

import Image from "next/image";
import { Menu } from "./Menu";
import { Tags } from "./Tags";
import { Stats } from "./Stats";
import {
  Model,
  Nullable,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useAppEntity,
  useDeleteModel,
} from "../../lib";
import React from "react";
import {
  useToast,
  getModelHardwareToolkit,
  getModelRegionToolkit,
} from "@instill-ai/design-system";

export type CardModelProps = {
  model: Model;
  accessToken: Nullable<string>;
  onDelete: () => void;
};

export const CardModel = (props: CardModelProps) => {
  const { model, accessToken, onDelete } = props;
  const entity = useAppEntity();
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
      toastInstillError({
        title: "Something went wrong while deleting the model",
        error,
        toast,
      });
    }
  }, [model, amplitudeIsInit, deleteModel, onDelete, accessToken, toast]);

  return (
    <div className="flex flex-row gap-x-6 rounded-md border border-semantic-bg-line bg-white p-4">
      <img
        className="shrink-0 rounded"
        src={model.profile_image || "/images/models/model-placeholder.svg"}
        alt="Cover"
        width={156}
        height={156}
      />
      <div className="flex grow flex-col gap-y-2">
        <div className="flex w-full flex-row items-start gap-x-2">
          <a
            href={`/${entity.data.entity}/models/${model.id}`}
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
