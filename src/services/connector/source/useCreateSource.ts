import { useMutation, useQueryClient } from "react-query";
import {
  createSourceMutation,
  CreateSourcePayload,
  getSourceDefinitionQuery,
  SourceWithDefinition,
} from "@/lib/instill";

const useCreateSource = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateSourcePayload) => {
      const res = await createSourceMutation(payload);
      return Promise.resolve(res);
    },
    {
      onSuccess: async (newSource) => {
        const sourceDefinition = await getSourceDefinitionQuery(
          newSource.source_connector_definition
        );

        const newSourceWithDefinition: SourceWithDefinition = {
          ...newSource,
          source_connector_definition: sourceDefinition,
        };

        queryClient.setQueryData<SourceWithDefinition>(
          ["sources", newSource.id],
          newSourceWithDefinition
        );

        queryClient.setQueryData<SourceWithDefinition[]>(["sources"], (old) =>
          old ? [newSourceWithDefinition, ...old] : [newSourceWithDefinition]
        );
      },
    }
  );
};

export default useCreateSource;
