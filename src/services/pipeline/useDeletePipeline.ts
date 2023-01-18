import { deletePipelineMutation, Pipeline } from "@/lib/instill";
import { useMutation, useQueryClient } from "react-query";

export const useDeletePipeline = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (pipelineName: string) => {
      await deletePipelineMutation(pipelineName);
      return pipelineName;
    },
    {
      onSuccess: (pipelineName) => {
        const pipelineId = pipelineName.split("/")[1];

        queryClient.removeQueries(["pipelines", pipelineId], { exact: true });

        const pipelines = queryClient.getQueryData<Pipeline[]>(["pipelines"]);

        if (pipelines) {
          queryClient.setQueryData<Pipeline[]>(
            ["pipelines"],
            pipelines.filter((e) => e.name !== pipelineName)
          );
        }
      },
    }
  );
};
