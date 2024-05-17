"use client";

import { CardModel } from "../../components/card-model/CardModel";
import { InstillStore, Model, useInstillStore, useShallow } from "../../lib";
import { CardModelSkeleton } from "../../components/card-model/Skeleton";

export type ModelsListProps = {
  models: Model[];
  onModelDelete: () => void;
  isLoading: boolean;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const ModelsList = (props: ModelsListProps) => {
  const { models, onModelDelete, isLoading } = props;
  const { accessToken } = useInstillStore(useShallow(selector));

  if (models?.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-col gap-y-4">
      {isLoading
        ? Array.from(new Array(5)).map((_item, index) => (
            <CardModelSkeleton key={index} />
          ))
        : models.map((model, index) => {
            return (
              <CardModel
                model={model}
                key={index}
                accessToken={accessToken}
                onDelete={onModelDelete}
              />
            );
          })}
    </div>
  );
};
