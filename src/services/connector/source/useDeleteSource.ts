import { deleteSourceMutation, SourceWithDefinition } from "@/lib/instill";
import { useMutation, useQueryClient } from "react-query";

const useDeleteSource = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (sourceName: string) => {
      await deleteSourceMutation(sourceName);
      return sourceName;
    },
    {
      onSuccess: (sourceName) => {
        const sourceId = sourceName.split("/")[1];

        queryClient.removeQueries(["sources", sourceId], { exact: true });

        const sources = queryClient.getQueryData<SourceWithDefinition[]>([
          "sources",
        ]);

        if (sources) {
          queryClient.setQueryData<SourceWithDefinition[]>(
            ["sources"],
            sources.filter((e) => e.name !== sourceName)
          );
        }
      },
    }
  );
};

export default useDeleteSource;
