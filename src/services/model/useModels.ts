import { useQuery } from "@tanstack/react-query";
import { listModelsQuery } from "@/lib/instill";
import { defaultQueryParam } from "../helper";

export const useModels = () => {
  return useQuery(
    ["models"],
    async () => {
      const models = await listModelsQuery(
        defaultQueryParam.pageSize,
        defaultQueryParam.nextPageToken
      );
      return Promise.resolve(models);
    },
    {
      retry: 3,
    }
  );
};
