"use client";

import { CardModel } from "../../components/card-model/CardModel";
import { Model } from "../../lib";

export type ModelsListProps = {
  models: Model[];
  //modelsWatchState: ModelsWatchState;
  //isError: boolean;
  //isLoading: boolean;
};

export const ModelsList = (props: ModelsListProps) => {
  const { models/* , modelsWatchState, isError, isLoading */ } = props;

  if (models.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-col gap-y-4">
      {
        models.map((model, index) => {
          return <CardModel model={model} key={index} />
        })
      }
    </div>
  )
}