import {
  Nullable,
  createInstillAxiosClient,
  useQuery,
} from "@instill-ai/toolkit";

import { NewPipeline } from "./type";
export type GetPipelineResponse = {
  pipeline: NewPipeline;
};

export async function getPipelineQuery({
  pipelineName,
  accessToken,
}: {
  pipelineName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.get<GetPipelineResponse>(
      `/${pipelineName}?view=VIEW_FULL`
    );

    return Promise.resolve(data.pipeline);
  } catch (err) {
    return Promise.reject(err);
  }
}

export const usePipeline = ({
  pipelineName,
  accessToken,
  enabled,
  retry,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (pipelineName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["pipelines", pipelineName],
    async () => {
      if (!pipelineName) {
        return Promise.reject(new Error("invalid pipeline name"));
      }
      const pipeline = await getPipelineQuery({ pipelineName, accessToken });
      return Promise.resolve(pipeline);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
