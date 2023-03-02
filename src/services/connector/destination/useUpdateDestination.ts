import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DestinationWithDefinition,
  getDestinationDefinitionQuery,
  updateDestinationMutation,
  UpdateDestinationPayload,
} from "@/lib/instill";

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: UpdateDestinationPayload) => {
      const res = await updateDestinationMutation(payload);
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

        queryClient.invalidateQueries({
          queryKey: ["destinations", "with-pipelines"],
        });

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
