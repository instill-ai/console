import { useQuery } from "react-query";
import { listModelsQuery } from "@/lib/instill";

export const useModels = () => {
  return useQuery(
    ["models"],
    async () => {
      const models = await listModelsQuery();
      return Promise.resolve(models);
    },
    {
      retry: 3,
    }
  );
};
