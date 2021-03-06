import { useQuery } from "react-query";
import {
  DestinationWithDefinition,
  getDestinationDefinitionQuery,
  listDestinationsQuery,
} from "@/lib/instill";

const useDestinations = () => {
  return useQuery(
    ["destinations"],
    async () => {
      const destinations = await listDestinationsQuery();
      const destinationsWithDefinition: DestinationWithDefinition[] = [];

      for (const destination of destinations) {
        const destinationDefinition = await getDestinationDefinitionQuery(
          destination.destination_connector_definition
        );
        destinationsWithDefinition.push({
          ...destination,
          destination_connector_definition: destinationDefinition,
        });
      }

      return Promise.resolve(destinationsWithDefinition);
    },
    {
      retry: 3,
    }
  );
};

export default useDestinations;
