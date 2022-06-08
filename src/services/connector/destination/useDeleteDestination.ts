import {
  deleteDestinationMutation,
  DestinationWithDefinition,
} from "@/lib/instill";
import { useMutation, useQueryClient } from "react-query";

const useDeleteDestination = (destinationName: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      await deleteDestinationMutation(destinationName);
    },
    {
      onSuccess: () => {
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
        } else {
          queryClient.invalidateQueries(["sources"]);
        }
      },
    }
  );
};

export default useDeleteDestination;
