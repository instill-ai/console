"use client";

import type { Model } from "instill-sdk";
import cn from "clsx";

import { useToast } from "@instill-ai/design-system";

import { CardModel } from "../../components/card-model/CardModel";
import { CardModelSkeleton } from "../../components/card-model/Skeleton";
import {
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useDeleteNamespaceModel,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../../lib";

export type ModelsListProps = {
  models: Model[];
  onModelDelete: () => void;
  isLoading: boolean;
  isSearchActive: boolean;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const ModelsList = (props: ModelsListProps) => {
  const routeInfo = useRouteInfo();
  const { models, onModelDelete, isLoading, isSearchActive } = props;
  const { accessToken } = useInstillStore(useShallow(selector));
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { toast } = useToast();

  const isEmpty = !isLoading && models.length === 0;

  /* -------------------------------------------------------------------------
   * Handle delete model
   * -----------------------------------------------------------------------*/

  const deleteModel = useDeleteNamespaceModel();
  const handleDeleteModel = async (model: Model) => {
    if (!model || !routeInfo.isSuccess || !routeInfo.data.namespaceId) return;

    try {
      await deleteModel.mutateAsync({
        namespaceId: routeInfo.data.namespaceId,
        modelId: model.id,
        accessToken,
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("delete_model");
      }

      if (onModelDelete) {
        onModelDelete();
      }
    } catch (error) {
      toastInstillError({
        title: "Something went wrong while deleting the model",
        error,
        toast,
      });
    }
  };

  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-y-4",
        isEmpty ? "items-center justify-center" : null,
      )}
    >
      {isLoading ? (
        Array.from(new Array(5)).map((_item, index) => (
          <CardModelSkeleton key={index} />
        ))
      ) : !isEmpty ? (
        models.map((model, index) => {
          return (
            <CardModel model={model} key={index} onDelete={handleDeleteModel} />
          );
        })
      ) : (
        <div className="relative">
          <img
            width={513}
            height={481}
            src="/images/models/no-models-placeholder.svg"
            alt="A box and a looking glass"
          />
          <p className="absolute left-1/2 top-3/4 flex -translate-x-1/2 flex-col items-center gap-y-2 text-center text-xl font-semibold text-semantic-fg-primary">
            <span className="whitespace-nowrap">No models found</span>
            <span className="text-base font-normal text-semantic-fg-secondary">
              {isSearchActive
                ? "Your search did not match any models"
                : "Once you create a model, it will appear here"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
