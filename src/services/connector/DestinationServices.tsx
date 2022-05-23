import {
  createDestinationMutation,
  CreateDestinationPayload,
  listDestinationDefinitionsQuery,
} from "@/lib/instill";
import { useMutation, useQuery } from "react-query";

// ###################################################################
// #                                                                 #
// # [Query] Destination definition                                  #
// #                                                                 #
// ###################################################################

export const useDestinationDefinitions = () => {
  return useQuery(["destination", "definitions"], async () => {
    const destinationDefinition = await listDestinationDefinitionsQuery();
    return Promise.resolve(destinationDefinition);
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
