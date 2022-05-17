import { Mode, Status } from "@/types/general";
import axios from "axios";
import { Model } from "./model";

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR";

export type Pipeline = {
  id: string;
  description: string;
  mode: Mode;
  status: Status;
  owner_id: string;
  full_name: string;
  create_time: string;
  update_time: string;
  recipe: PipelineRecipe;
};

export type RawPipeline = {
  name: string;
  uid: string;
  id: string;
  description: string;
  recipe: PipelineRawRecipe;
  mode: PipelineMode;
  state: PipelineState;
  user: string;
  org: string;
  create_time: string;
  update_time: string;
};

export type PipelineRawRecipe = {
  source: string;
  destination: string;
  model_instances: string;
};

export type PipelineRecipe = {
  source: {
    name: string;
    type: string;
  };
  destination: {
    name: string;
    type: string;
  };
  models: Model[];
};

export type ListPipelinesResponse = {
  pipelines: RawPipeline[];
  next_page_token: string;
  total_size: string;
};

export const listPipelinesQuery = async () => {
  try {
    const res = await axios.get<ListPipelinesResponse>(
      `${process.env.NEXT_PUBLIC_PIPELINE_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/pipelines?view=VIEW_FULL`
    );

    return Promise.resolve(res.data.pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
};
