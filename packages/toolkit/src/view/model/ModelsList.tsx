"use client";

import { InfiniteData, QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { CardModel } from "../../components/card-model/CardModel";
import { ListUserModelsResponse, Model, Nullable } from "../../lib";
import { CardModelSkeleton } from "../../components/card-model/Skeleton";

export type ModelsListProps = {
  models: Model[];
  accessToken: Nullable<string>;
  onModelDelete: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<InfiniteData<ListUserModelsResponse, unknown>, Error>>;
  isLoading: boolean;
};

export const ModelsList = (props: ModelsListProps) => {
  const { models, accessToken, onModelDelete, isLoading } = props;

  if (models.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-col gap-y-4">
      {
        isLoading
          ? Array.from(new Array(5)).map((_item, index) => <CardModelSkeleton key={index} />)
          : models.map((model, index) => {
            return <CardModel model={model} key={index} accessToken={accessToken} onDelete={onModelDelete} />
          })
      }
    </div>
  )
}