"use client";

import { CardModel } from "../../components/card-model/CardModel";
import { InstillStore, Model, useInstillStore, useShallow } from "../../lib";
import { CardModelSkeleton } from "../../components/card-model/Skeleton";
import cn from "clsx";

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
  const { models, onModelDelete, isLoading, isSearchActive } = props;
  const { accessToken } = useInstillStore(useShallow(selector));

  const isEmpty = !isLoading && models.length === 0;

  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-y-4",
        isEmpty ? "relative items-center justify-center" : null
      )}
    >
      {isLoading ? (
        Array.from(new Array(5)).map((_item, index) => (
          <CardModelSkeleton key={index} />
        ))
      ) : !isEmpty ? (
        models.map((model, index) => {
          return (
            <CardModel
              model={model}
              key={index}
              accessToken={accessToken}
              onDelete={onModelDelete}
            />
          );
        })
      ) : (
        <div className="">
          <img
            src="/images/models/no-models-placeholder.svg"
            alt="A box and a looking glass"
          />
          <p className="absolute left-1/2 top-2/3 flex -translate-x-1/2 flex-col items-center gap-y-2 text-xl font-semibold text-semantic-fg-primary">
            No Models found
            {isSearchActive ? (
              <span className="text-base font-normal text-semantic-fg-secondary">
                Your search did not match any models
              </span>
            ) : null}
          </p>
        </div>
      )}
    </div>
  );
};
