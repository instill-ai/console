import { useMutation, useQueryClient } from "react-query";
import {
  createDestinationMutation,
  CreateDestinationPayload,
  DestinationWithDefinition,
  getDestinationDefinitionQuery,
} from "@/lib/instill";

const useCreateDestination = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateDestinationPayload) => {
      const res = await createDestinationMutation(payload);
      return Promise.resolve(res);
    },
    {
      onSuccess: async (newDestination) => {
        const destinationDefinition = await getDestinationDefinitionQuery(
          newDestination.destination_connector_definition
        );

        const newDestinationWithDefinition: DestinationWithDefinition = {
          ...newDestination,
          destination_connector_definition: destinationDefinition,
        };

        queryClient.setQueryData<DestinationWithDefinition>(
          ["destinations", newDestination.id],
          newDestinationWithDefinition
        );

        queryClient.setQueryData<DestinationWithDefinition[]>(
          ["destinations"],
          (old) =>
            old
              ? [newDestinationWithDefinition, ...old]
              : [newDestinationWithDefinition]
        );
      },
    }
  );
};

export default useCreateDestination;
