import {
  createDestinationMutation,
  CreateDestinationPayload,
  DestinationWithDefinition,
  DestinationWithPipelines,
  getDestinationDefinitionQuery,
  getDestinationQuery,
  listDestinationDefinitionsQuery,
  listDestinationsQuery,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useMutation, useQuery } from "react-query";
import { usePipelines } from "../pipeline/PipelineServices";

// ###################################################################
// #                                                                 #
// # [Query] Destination definition                                  #
// #                                                                 #
// ###################################################################

export const useDestinationDefinitions = () => {
  return useQuery(["destinations", "definition"], async () => {
    const destinationDefinition = await listDestinationDefinitionsQuery();
    return Promise.resolve(destinationDefinition);
  });
};

export const useDestinations = () => {
  return useQuery(["destinations"], async () => {
    const destinations = await listDestinationsQuery();
    return Promise.resolve(destinations);
  });
};

export const useDestination = (destinationName: Nullable<string>) => {
  return useQuery(["destinations", destinationName], async () => {
    if (!destinationName) {
      return Promise.reject(new Error("invalid destination name"));
    }

    const destination = await getDestinationQuery(destinationName);
    const destinationDefinition = await getDestinationDefinitionQuery(
      destination.destination_connector_definition
    );
    const destinationWithDefinition: DestinationWithDefinition = {
      ...destination,
      destination_connector_definition: destinationDefinition,
    };

    return Promise.resolve(destinationWithDefinition);
  });
};

export const useDestinationWithPipelines = (
  destinationName: Nullable<string>
) => {
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

// ###################################################################
// #                                                                 #
// # [Mutation] Destination                                          #
// #                                                                 #
// ###################################################################

export const useCreateDestination = () => {
  return useMutation(async (payload: CreateDestinationPayload) => {
    const res = await createDestinationMutation(payload);
    return Promise.resolve(res);
  });
};
