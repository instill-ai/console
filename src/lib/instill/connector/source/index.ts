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

import type { CreateSourcePayload, CreateSourceResponse } from "./mutations";
import { createSourceMutation, deleteSourceMutation } from "./mutations";

export type {
  Source,
  SourceWithDefinition,
  SourceWithPipelines,
  ListSourceDefinitionsResponse,
  GetSourceDefinitionResponse,
  ListSourcesResponse,
  GetSourceResponse,
  CreateSourcePayload,
  CreateSourceResponse,
};

export {
  listSourceDefinitionsQuery,
  getSourceDefinitionQuery,
  listSourcesQuery,
  getSourceQuery,
  createSourceMutation,
  deleteSourceMutation,
};
