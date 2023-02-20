import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDestinationMutation,
  CreateDestinationPayload,
  DestinationWithDefinition,
  getDestinationDefinitionQuery,
} from "@/lib/instill";

export const useCreateDestination = () => {
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
              ? [
                  ...old.filter((e) => e.id !== newDestination.id),
                  newDestinationWithDefinition,
                ]
              : [newDestinationWithDefinition]
        );
      },
    }
  );
};
