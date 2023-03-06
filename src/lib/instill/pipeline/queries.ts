import { Nullable } from "@/types/general";
import { env } from "@/utils";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { PipelineWithRawRecipe } from "./types";

export type ListPipelinesResponse = {
  pipelines: PipelineWithRawRecipe[];
  next_page_token: string;
  total_size: string;
};

export const listPipelinesQuery = async (
  pageSize: Nullable<number>,
  nextPageToken: Nullable<string>
): Promise<PipelineWithRawRecipe[]> => {
  try {
    const client = createInstillAxiosClient();
    const pipelines: PipelineWithRawRecipe[] = [];

    const queryString = getQueryString(
      `${env("NEXT_PUBLIC_API_VERSION")}/pipelines?view=VIEW_FULL`,
      pageSize,
      nextPageToken
    );

    const { data } = await client.get<ListPipelinesResponse>(queryString);

    pipelines.push(...data.pipelines);

    if (data.next_page_token) {
      pipelines.push(
        ...(await listPipelinesQuery(pageSize, data.next_page_token))
      );
    }

    return Promise.resolve(pipelines);
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
