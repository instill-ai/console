"use client";

import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { CardModel } from "../../components/card-model/CardModel";
import { Model, Nullable } from "../../lib";

export type ModelsListProps = {
  models: Model[];
  accessToken: Nullable<string>;
  onModelDelete: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<Model[], Error>>
  //modelsWatchState: ModelsWatchState;
  //isError: boolean;
  //isLoading: boolean;
};

export const ModelsList = (props: ModelsListProps) => {
  const { models, accessToken, onModelDelete/* , modelsWatchState, isError, isLoading */ } = props;

  if (models.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-col gap-y-4">
      {
        models.map((model, index) => {
          return <CardModel model={model} key={index} accessToken={accessToken} onDelete={onModelDelete} />
        })
      }
    </div>
  )
}