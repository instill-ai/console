import axios from "axios";
import { DestinationWithDefinition, SourceWithDefinition } from "./connector";
import { ModelInstance } from "./model";

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR";

export type PipelineWithRawRecipe = {
  name: string;
  uid: string;
  id: string;
  description: string;
  recipe: RawPipelineRecipe;
  mode: PipelineMode;
  state: PipelineState;
  user: string;
  org: string;
  create_time: string;
  update_time: string;
};

export type Pipeline = {
  name: string;
  uid: string;
  id: string;
  description: string;
  recipe: PipelineRecipe;
  mode: PipelineMode;
  state: PipelineState;
  user: string;
  org: string;
  create_time: string;
  update_time: string;
};

export type RawPipelineRecipe = {
  source: string;
  destination: string;
  model_instances: string;
};

export type PipelineRecipe = {
  source: SourceWithDefinition;
  destination: DestinationWithDefinition;
  models: ModelInstance[];
};

export type ListPipelinesResponse = {
  pipelines: PipelineWithRawRecipe[];
  next_page_token: string;
  total_size: string;
};

export const listPipelinesQuery = async (): Promise<
  PipelineWithRawRecipe[]
> => {
  try {
    const { data } = await axios.get<ListPipelinesResponse>(
      "/api/pipeline/list-pipelines"
    );

    return Promise.resolve(data.pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetPipelineResponse = {
  pipeline: PipelineWithRawRecipe;
};

export const getPipelineQuery = async (
  pipelineId: string
): Promise<PipelineWithRawRecipe> => {
  try {
    const { data } = await axios.post<GetPipelineResponse>(
      "/api/pipeline/get-pipeline",
      { id: pipelineId }
    );

    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type CreatePipelinePayload = {
  id: string;
  recipe: {
    source: string;
    model_instances: string[];
    destination: string;
  };
};

export type CreatePipelineResponse = {
  pipeline: PipelineWithRawRecipe;
};

export const createPipelineMutation = async (
  payload: CreatePipelinePayload
): Promise<PipelineWithRawRecipe> => {
  try {
    const { data } = await axios.post<CreatePipelineResponse>(
      "/api/pipeline/create-pipeline",
      payload
    );
    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
};
