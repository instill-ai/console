import { deleteSourceMutation, SourceWithDefinition } from "@/lib/instill";
import { useMutation, useQueryClient } from "react-query";

const useDeleteSource = (sourceName: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      await deleteSourceMutation(sourceName);
    },
    {
      onSuccess: () => {
        const sourceId = sourceName.split("/")[1];

        queryClient.removeQueries(["sources", sourceId], { exact: true });

        const sources = queryClient.getQueryData<SourceWithDefinition[]>([
          "sources",
        ]);

        if (sources) {
          queryClient.setQueryData<SourceWithDefinition[]>(["sources"], (old) =>
            old ? old.filter((e) => e.name !== sourceName) : []
          );
        } else {
          queryClient.invalidateQueries(["sources"]);
        }
      },
    }
  );
};

export default useDeleteSource;
