import { useQuery } from "@tanstack/react-query";
import { listDestinationDefinitionsQuery } from "@/lib/instill";

export const useDestinationDefinitions = () => {
  return useQuery(
    ["destinations", "definition"],
    async () => {
      const destinationDefinition = await listDestinationDefinitionsQuery(
        10,
        null
      );
      return Promise.resolve(destinationDefinition);
    },
    {
      retry: 3,
    }
  );
};
