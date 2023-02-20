import { useQuery } from "@tanstack/react-query";
import {
  DestinationWithDefinition,
  getDestinationDefinitionQuery,
  getDestinationQuery,
} from "@/lib/instill";
import { Nullable } from "@/types/general";

export const useDestination = (destinationName: Nullable<string>) => {
  return useQuery(
    ["destinations", destinationName],
    async () => {
      if (!destinationName) {
        return Promise.reject(new Error("invalid destination name"));
      }

      const destination = await getDestinationQuery(destinationName);
      const destinationDefinition = await getDestinationDefinitionQuery(
        destination.destination_connector_definition
      );
      const destinationWithDefinition: DestinationWithDefinition = {
        ...destination,
        destination_connector_definition: destinationDefinition,
      };

      return Promise.resolve(destinationWithDefinition);
    },
    {
      enabled: destinationName ? true : false,
      retry: 3,
    }
  );
};
