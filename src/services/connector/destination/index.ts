import {
  useDestination,
  useDestinations,
  useDestinationDefinitions,
} from "./queries";

import { useCreateDestination, useDeleteDestination } from "./mutations";

import {
  useDestinationsWithPipelines,
  useDestinationWithPipelines,
} from "./helpers";

export {
  useDestination,
  useDestinations,
  useDestinationWithPipelines,
  useDestinationsWithPipelines,
  useDestinationDefinitions,
  useCreateDestination,
  useDeleteDestination,
};
