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

import type {
  CreateDestinationPayload,
  CreateDestinationResponse,
  UpdateDestinationResponse,
} from "./mutations";

import {
  createDestinationMutation,
  deleteDestinationMutation,
  updateDestinationMutation,
} from "./mutations";

export type {
  Destination,
  DestinationWithDefinition,
  DestinationWithPipelines,
  ListDestinationDefinitionsResponse,
  GetDestinationDefinitionResponse,
  ListDestinationsResponse,
  GetDestinationResponse,
  CreateDestinationPayload,
  CreateDestinationResponse,
  UpdateDestinationResponse,
};

export {
  listDestinationDefinitionsQuery,
  getDestinationDefinitionQuery,
  listDestinationsQuery,
  getDestinationQuery,
  createDestinationMutation,
  deleteDestinationMutation,
  updateDestinationMutation,
};
