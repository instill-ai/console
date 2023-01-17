import { useQuery } from "react-query";
import { listSourceDefinitionsQuery } from "@/lib/instill";

export const useSourceDefinitions = () => {
  return useQuery(
    ["sources", "definition"],
    async () => {
      const sourceDefinitions = await listSourceDefinitionsQuery();
      return Promise.resolve(sourceDefinitions);
    },
    {
      retry: 3,
    }
  );
};
