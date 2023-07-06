import { PipelineTrigger } from "@/types";
import {
  Nullable,
  createInstillAxiosClient,
  env,
  getQueryString,
  useQuery,
} from "@instill-ai/toolkit";

export type ListPipelinesTriggerResponse = {
  pipeline_trigger_records: PipelineTrigger[];
  next_page_token: string;
  total_size: string;
};

export async function filterPipelinesQuery({
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
    const triggers: PipelineTrigger[] = [];

    const queryString = getQueryString(
      `/metrics/vdp/pipeline/triggers`,
      pageSize,
      nextPageToken,
      filter
    );

    const { data } = await client.get<ListPipelinesTriggerResponse>(
      queryString
    );

    triggers.push(...data.pipeline_trigger_records);

    if (data.next_page_token) {
      triggers.push(
        ...(await filterPipelinesQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
          filter,
        }))
      );
    }

    return Promise.resolve(triggers);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetPipelineTriggerResponse = {
  pipeline: PipelineTrigger;
};

export async function fetchPipelines(
  accessToken: Nullable<string>,
  filter: Nullable<string>
) {
  try {
    const triggers = await filterPipelinesQuery({
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      nextPageToken: null,
      accessToken,
      filter,
    });
    return Promise.resolve(triggers);
  } catch (err) {
    return Promise.reject(err);
  }
}

export const usePipelineFilter = ({
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
    ["metrics", filter],
    async () => {
      const triggers = await fetchPipelines(accessToken, filter);
      return Promise.resolve(triggers);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
