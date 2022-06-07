import { useQuery } from "react-query";
import { DestinationWithPipelines } from "@/lib/instill";
import { usePipelines } from "@/services/pipeline/PipelineServices";
import { Nullable } from "@/types/general";
import useDestination from "./useDestination";

const useDestinationWithPipelines = (destinationName: Nullable<string>) => {
  const pipelines = usePipelines(true);
  const destination = useDestination(destinationName);
  return useQuery(
    ["destinations", destinationName, "with-pipelines"],
    async () => {
      if (!destinationName) {
        return Promise.reject(new Error("invalid destination name"));
      }

      if (!destination.data) {
        return Promise.reject(new Error("invalid destination data"));
      }

      if (!pipelines.data) {
        return Promise.reject(new Error("invalid pipeline data"));
      }

      const targetPipelines = pipelines.data.filter(
        (e) => e.recipe.destination.name === destinationName
      );

      const destinationWithPipelines: DestinationWithPipelines = {
        ...destination.data,
        pipelines: targetPipelines,
      };

      return Promise.resolve(destinationWithPipelines);
    },
    {
      enabled: destinationName
        ? destination.isSuccess
          ? pipelines.isSuccess
            ? true
            : false
          : false
        : false,
    }
  );
};

export default useDestinationWithPipelines;
