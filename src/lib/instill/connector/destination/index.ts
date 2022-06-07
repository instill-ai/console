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
} from "./mutations";

import { createDestinationMutation } from "./mutations";

export {
  listDestinationDefinitionsQuery,
  getDestinationDefinitionQuery,
  listDestinationsQuery,
  getDestinationQuery,
  createDestinationMutation,
};

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
};
