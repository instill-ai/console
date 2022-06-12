import { useQuery } from "react-query";
import { listDestinationDefinitionsQuery } from "@/lib/instill";

const useDestinationDefinitions = () => {
  return useQuery(
    ["destinations", "definition"],
    async () => {
      const destinationDefinition = await listDestinationDefinitionsQuery();
      return Promise.resolve(destinationDefinition);
    },
    {
      retry: 3,
    }
  );
};

export default useDestinationDefinitions;
