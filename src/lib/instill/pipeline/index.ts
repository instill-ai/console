import { mockPipelines } from "./mocks";

import type {
  PipelineMode,
  PipelineState,
  Pipeline,
  PipelineWithRawRecipe,
  RawPipelineRecipe,
  PipelineRecipe,
} from "./types";

import type { ListPipelinesResponse, GetPipelineResponse } from "./queries";

import { listPipelinesQuery, getPipelineQuery } from "./queries";

import type {
  CreatePipelinePayload,
  CreatePipelineResponse,
  UpdatePipelinePayload,
  UpdatePipelineResponse,
} from "./mutations";

import { createPipelineMutation, updatePipelineMutation } from "./mutations";

import type {
  ActivatePipelineResponse,
  DeActivatePipelineResponse,
} from "./actions";

import {
  activatePipelineMutation,
  deActivatePipelineMutation,
} from "./actions";

export type {
  PipelineMode,
  PipelineState,
  Pipeline,
  PipelineWithRawRecipe,
  RawPipelineRecipe,
  PipelineRecipe,
  ListPipelinesResponse,
  GetPipelineResponse,
  CreatePipelinePayload,
  CreatePipelineResponse,
  UpdatePipelinePayload,
  UpdatePipelineResponse,
  ActivatePipelineResponse,
  DeActivatePipelineResponse,
};

export {
  mockPipelines,
  listPipelinesQuery,
  getPipelineQuery,
  createPipelineMutation,
  updatePipelineMutation,
  activatePipelineMutation,
  deActivatePipelineMutation,
};
