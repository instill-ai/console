import { useQuery, useQueryClient } from "react-query";
import { Pipeline } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { usePipelines } from "./usePipelines";

export const usePipelinesHaveTargetDestination = (
  destinationId: Nullable<string>
) => {
  const pipelines = usePipelines(true);
  const queryClient = useQueryClient();

  return useQuery(
    ["pipelines", "destination", destinationId],
    async () => {
      const targetPipelines = [];

      if (!pipelines.data) {
        return Promise.reject("pipelines not exist");
      }

      for (const pipeline of pipelines.data) {
        if (pipeline.recipe.destination.id === destinationId) {
          targetPipelines.push(pipeline);
        }
      }

      return Promise.resolve(targetPipelines);
    },
    {
      initialData: () => {
        const pipelines = queryClient.getQueryData<Pipeline[]>(["pipelines"]);

        if (pipelines) {
          const targetPipelines = [];

          for (const pipeline of pipelines) {
            if (pipeline.recipe.destination.id === destinationId) {
              targetPipelines.push(pipeline);
            }
          }

          return targetPipelines;
        }
      },
      enabled: destinationId ? (pipelines.data ? true : false) : false,
      retry: 3,
    }
  );
};

export default usePipelinesHaveTargetDestination;
