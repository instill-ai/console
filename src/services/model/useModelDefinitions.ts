import { useQuery } from "react-query";
import { listModelDefinitionsQuery } from "@/lib/instill";

const useModelDefinitions = () => {
  return useQuery(["models", "definition"], async () => {
    const definitions = await listModelDefinitionsQuery();
    return Promise.resolve(definitions);
  });
};

export default useModelDefinitions;
