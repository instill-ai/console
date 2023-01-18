import { env } from "@/utils";
import { createInstillAxiosClient } from "../helper";
import { PipelineWithRawRecipe } from "./types";

export type ListPipelinesResponse = {
  pipelines: PipelineWithRawRecipe[];
  next_page_token: string;
  total_size: string;
};

export const listPipelinesQuery = async (): Promise<
  PipelineWithRawRecipe[]
> => {
  try {
    const client = createInstillAxiosClient();

    const { data } = await client.get<ListPipelinesResponse>(
      `${env("NEXT_PUBLIC_API_VERSION")}/pipelines?view=VIEW_FULL`
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
  pipelineName: string
): Promise<PipelineWithRawRecipe> => {
  try {
    const client = createInstillAxiosClient();

    const { data } = await client.get<GetPipelineResponse>(
      `${env("NEXT_PUBLIC_API_VERSION")}/${pipelineName}?view=VIEW_FULL`
    );

    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
};
