import {
  deleteDestinationMutation,
  DestinationWithDefinition,
  DestinationWithPipelines,
} from "@/lib/instill";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (destinationName: string) => {
      await deleteDestinationMutation(destinationName);
      return destinationName;
    },
    {
      onSuccess: (destinationName) => {
        const destinationId = destinationName.split("/")[1];

        queryClient.removeQueries(["destinations", destinationId], {
          exact: true,
        });

        queryClient.setQueryData<DestinationWithDefinition[]>(
          ["destinations"],
          (old) => {
            if (!old) return;
            return old.filter((e) => e.name !== destinationName);
          }
        );

        queryClient.setQueryData<DestinationWithPipelines[]>(
          ["destinations", "with-pipelines"],
          (old) => {
            if (!old) return;
            return old.filter((e) => e.name !== destinationName);
          }
        );
      },
    }
  );
};
