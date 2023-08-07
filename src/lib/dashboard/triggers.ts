import {
  Nullable,
  createInstillAxiosClient,
  env,
  getQueryString,
  useQuery,
} from "@instill-ai/toolkit";

export type TriggeredPipeline = {
  pipeline_id: string;
  pipeline_uid: string;
  trigger_count_completed: string;
  trigger_count_errored: string;
};

export type ListTriggeredPipelinesResponse = {
  pipeline_trigger_table_records: TriggeredPipeline[];
  next_page_token: string;
  total_size: string;
};

export async function listTriggeredPipelineQuery({
  pageSize,
  nextPageToken,
  accessToken,
  filter,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "base");
    const pipelines: TriggeredPipeline[] = [];

    const queryString = getQueryString(
      `/metrics/vdp/pipeline/tables`,
      pageSize,
      nextPageToken,
      filter
    );

    const { data } = await client.get<ListTriggeredPipelinesResponse>(
      queryString
    );

    pipelines.push(...data.pipeline_trigger_table_records);

    if (data.next_page_token) {
      pipelines.push(
        ...(await listTriggeredPipelineQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
          filter,
        }))
      );
    }

    return Promise.resolve(pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
}

export const useTriggeredPipelines = ({
  enabled,
  accessToken,
  filter,
  retry,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  return useQuery(
    [filter],
    async () => {
      const triggers = await listTriggeredPipelineQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter,
      });
      return Promise.resolve(triggers);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
