import axios from "axios";
import { PipelineWithRawRecipe } from "./types";

export type ActivatePipelineResponse = {
  pipeline: PipelineWithRawRecipe;
};

export const activatePipelineMutation = async (pipelineName: string) => {
  try {
    const { data } = await axios.post<ActivatePipelineResponse>(
      `${process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${pipelineName}/activate`
    );
    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type DeActivatePipelineResponse = {
  pipeline: PipelineWithRawRecipe;
};

export const deActivatePipelineMutation = async (pipelineName: string) => {
  try {
    const { data } = await axios.post<DeActivatePipelineResponse>(
      `${process.env.NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${pipelineName}/deactivate`
    );
    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
};
