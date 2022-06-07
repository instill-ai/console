import type {
  Source,
  SourceWithDefinition,
  SourceWithPipelines,
} from "./types";

import type {
  ListSourceDefinitionsResponse,
  GetSourceDefinitionResponse,
  ListSourcesResponse,
  GetSourceResponse,
} from "./queries";

import {
  listSourceDefinitionsQuery,
  getSourceDefinitionQuery,
  listSourcesQuery,
  getSourceQuery,
} from "./queries";

export {
  Source,
  SourceWithDefinition,
  SourceWithPipelines,
  ListSourceDefinitionsResponse,
  GetSourceDefinitionResponse,
  ListSourcesResponse,
  GetSourceResponse,
};

export {
  listSourceDefinitionsQuery,
  getSourceDefinitionQuery,
  listSourcesQuery,
  getSourceQuery,
};
