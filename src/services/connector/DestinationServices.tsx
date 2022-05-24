import {
  createDestinationMutation,
  CreateDestinationPayload,
  listDestinationDefinitionsQuery,
  listDestinationsQuery,
} from "@/lib/instill";
import { useMutation, useQuery } from "react-query";

// ###################################################################
// #                                                                 #
// # [Query] Destination definition                                  #
// #                                                                 #
// ###################################################################

export const useDestinationDefinitions = () => {
  return useQuery(["destinations", "definition"], async () => {
    const destinationDefinition = await listDestinationDefinitionsQuery();
    return Promise.resolve(destinationDefinition);
  });
};

export const useDestinations = () => {
  return useQuery(["destinations"], async () => {
    const destinations = await listDestinationsQuery();
    return Promise.resolve(destinations);
  });
};

// ###################################################################
// #                                                                 #
// # [Mutation] Destination                                          #
// #                                                                 #
// ###################################################################

export const useCreateDestination = () => {
  return useMutation(async (payload: CreateDestinationPayload) => {
    const res = await createDestinationMutation(payload);
    return Promise.resolve(res);
  });
};
