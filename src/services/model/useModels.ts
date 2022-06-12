import { useQuery } from "react-query";
import { listModelsQuery } from "@/lib/instill";

const useModels = () => {
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

export default useModels;
