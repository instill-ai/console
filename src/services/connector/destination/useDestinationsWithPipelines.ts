import { useQuery } from "react-query";

import { DestinationWithPipelines } from "@/lib/instill";
import { usePipelines } from "@/services/pipeline";
import useDestinations from "./useDestinations";

const useDestinationsWithPipelines = () => {
  const destinations = useDestinations();
  const pipelines = usePipelines(true);
  return useQuery(
    ["destinations", "with-pipelines"],
    async () => {
      if (!destinations.data || !pipelines.data) return [];

      const newDestinations: DestinationWithPipelines[] = [];

      for (const destination of destinations.data) {
        const targetPipelines = pipelines.data.filter(
          (e) => e.recipe.destination.id === destination.id
        );
        newDestinations.push({
          ...destination,
          pipelines: targetPipelines,
        });
      }

      return newDestinations;
    },
    {
      enabled: destinations.isSuccess
        ? pipelines.isSuccess
          ? true
          : false
        : false,
    }
  );
};

export default useDestinationsWithPipelines;
