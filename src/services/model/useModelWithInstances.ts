import { useQuery } from "@tanstack/react-query";
import {
  listModelInstancesQuery,
  Model,
  ModelWithInstance,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { determineModelState } from "@/utils";
import { defaultQueryParam } from "../helper";

export const useModelWithInstances = (model: Nullable<Model>) => {
  return useQuery(
    ["models", "with-instances", model?.name],
    async () => {
      if (!model) {
        return Promise.reject(new Error("Model data not provided"));
      }

      const modelInstances = await listModelInstancesQuery(
        model.name,
        defaultQueryParam.pageSize,
        defaultQueryParam.nextPageToken
      );

      const modelWithInstances: ModelWithInstance = {
        ...model,
        instances: modelInstances,
        state: determineModelState(modelInstances),
      };

      return Promise.resolve(modelWithInstances);
    },
    { enabled: model ? true : false, retry: 3 }
  );
};
