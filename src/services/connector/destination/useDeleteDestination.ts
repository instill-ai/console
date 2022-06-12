import {
  deleteDestinationMutation,
  DestinationWithDefinition,
} from "@/lib/instill";
import { useMutation, useQueryClient } from "react-query";

const useDeleteDestination = () => {
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

        const destinations = queryClient.getQueryData<
          DestinationWithDefinition[]
        >(["sources"]);

        if (destinations) {
          queryClient.setQueryData<DestinationWithDefinition[]>(
            ["destinations"],
            destinations.filter((e) => e.name !== destinationName)
          );
        }
      },
    }
  );
};

export default useDeleteDestination;
