import {
  Destination,
  DestinationWithDefinition,
  DestinationWithPipelines,
} from "./types";

import type {
  ListDestinationDefinitionsResponse,
  GetDestinationDefinitionResponse,
  ListDestinationsResponse,
  GetDestinationResponse,
} from "./queries";

import {
  listDestinationDefinitionsQuery,
  getDestinationDefinitionQuery,
  listDestinationsQuery,
  getDestinationQuery,
} from "./queries";

export {
  listDestinationDefinitionsQuery,
  getDestinationDefinitionQuery,
  listDestinationsQuery,
  getDestinationQuery,
};

export type {
  Destination,
  DestinationWithDefinition,
  DestinationWithPipelines,
  ListDestinationDefinitionsResponse,
  GetDestinationDefinitionResponse,
  ListDestinationsResponse,
  GetDestinationResponse,
};
