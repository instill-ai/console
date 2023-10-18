import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserPipelineMutation, type Pipeline } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useDeleteUserPipeline = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      pipelineName,
      accessToken,
    }: {
      pipelineName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      await deleteUserPipelineMutation({ pipelineName, accessToken });

      return Promise.resolve(pipelineName);
    },
    {
      onSuccess: (pipelineName) => {
        // At this stage the pipelineName will be users/<uid>/pipelines/<pid>
        const pipelineNameArray = pipelineName.split("/");
        const userName = `${pipelineNameArray[0]}/${pipelineNameArray[1]}`;

        queryClient.setQueryData<Pipeline[]>(["pipelines"], (old) =>
          old ? old.filter((e) => e.name !== pipelineName) : []
        );

        queryClient.setQueryData<Pipeline[]>(["pipelines", userName], (old) =>
          old ? old.filter((e) => e.name !== pipelineName) : []
        );

        queryClient.removeQueries(["pipelines", pipelineName], { exact: true });

        // Process watch state
        queryClient.removeQueries(["pipelines", pipelineName, "watch"], {
          exact: true,
        });
      },
    }
  );
};
