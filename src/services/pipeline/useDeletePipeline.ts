import { deletePipelineMutation, Pipeline } from "@/lib/instill";
import { useMutation, useQueryClient } from "react-query";

const useDeletePipeline = (pipelineName: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      await deletePipelineMutation(pipelineName);
    },
    {
      onSuccess: () => {
        const pipelineId = pipelineName.split("/")[1];

        queryClient.removeQueries(["pipelines", pipelineId], { exact: true });

        const pipelines = queryClient.getQueryData<Pipeline[]>(["pipelines"]);

        if (pipelines) {
          queryClient.setQueryData<Pipeline[]>(
            ["pipelines"],
            pipelines.filter((e) => e.name !== pipelineName)
          );
        } else {
          queryClient.invalidateQueries(["pipelines"]);
        }
      },
    }
  );
};

export default useDeletePipeline;
