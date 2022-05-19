import axios from "axios";
import { Destination, Source } from "./connector";
import { ModelInstance } from "./model";

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR";

export type Pipeline = {
  id: string;
  description: string;
  mode: PipelineMode;
  state: PipelineState;
  createTime: string;
  updateTime: string;
  recipe: PipelineRecipe;
  user: string;
  org: string;
};

export type PipelineWithRawRecipe = {
  id: string;
  description: string;
  mode: PipelineMode;
  state: PipelineState;
  createTime: string;
  updateTime: string;
  recipe: RawPipelineRecipe;
  user: string;
  org: string;
};

export type RawPipeline = {
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

export type RawPipelineRecipe = {
  source: string;
  destination: string;
  model_instances: string;
};

export type PipelineRecipe = {
  source: Source;
  destination: Destination;
  models: ModelInstance[];
};

export type ListPipelinesResponse = {
  pipelines: RawPipeline[];
  next_page_token: string;
  total_size: string;
};

export const listPipelinesQuery = async (): Promise<
  PipelineWithRawRecipe[]
> => {
  try {
    const res = await axios.get<ListPipelinesResponse>(
      `${process.env.NEXT_PUBLIC_PIPELINE_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/pipelines?view=VIEW_FULL`
    );

    return Promise.resolve(
      res.data.pipelines.map((e) => {
        return {
          id: e.id,
          description: e.description,
          mode: e.mode,
          state: e.state,
          user: e.user,
          org: e.org,
          createTime: e.create_time,
          updateTime: e.update_time,
          recipe: e.recipe,
        };
      })
    );
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetPipelineResponse = {
  pipeline: RawPipeline;
};

export const getPipelineQuery = async (
  pipelineId: string
): Promise<PipelineWithRawRecipe> => {
  try {
    const res = await axios.get<GetPipelineResponse>(
      `${process.env.NEXT_PUBLIC_PIPELINE_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${pipelineId}`
    );

    return Promise.resolve({
      id: res.data.pipeline.id,
      description: res.data.pipeline.description,
      mode: res.data.pipeline.mode,
      state: res.data.pipeline.state,
      user: res.data.pipeline.user,
      org: res.data.pipeline.org,
      createTime: res.data.pipeline.create_time,
      updateTime: res.data.pipeline.update_time,
      recipe: res.data.pipeline.recipe,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
