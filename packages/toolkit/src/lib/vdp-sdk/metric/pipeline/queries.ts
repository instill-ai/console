import { Nullable } from "../../../type";
import { createInstillAxiosClient, getQueryString } from "../../helper";
import {
  PipelineTriggerRecord,
  PipelinesChart,
  TriggeredPipeline,
} from "./types";

export type ListPipelineTriggerRecordsResponse = {
  pipeline_trigger_records: PipelineTriggerRecord[];
  next_page_token: string;
  total_size: number;
};

export type ListTriggeredPipelinesResponse = {
  pipeline_trigger_table_records: TriggeredPipeline[];
  next_page_token: string;
  total_size: number;
};

export type ListPipelinesChartResponse = {
  pipeline_trigger_chart_records: PipelinesChart[];
};

export async function listPipelineTriggerRecordsQuery({
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
    const client = createInstillAxiosClient(accessToken, "core");
    const triggers: PipelineTriggerRecord[] = [];

    const queryString = getQueryString({
      baseURL: `/metrics/vdp/pipeline/triggers`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } =
      await client.get<ListPipelineTriggerRecordsResponse>(queryString);

    triggers.push(...data.pipeline_trigger_records);

    if (data.next_page_token) {
      triggers.push(
        ...(await listPipelineTriggerRecordsQuery({
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
    const client = createInstillAxiosClient(accessToken, "core");
    const pipelines: TriggeredPipeline[] = [];

    const queryString = getQueryString({
      baseURL: `/metrics/vdp/pipeline/tables`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } =
      await client.get<ListTriggeredPipelinesResponse>(queryString);

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

export async function listTriggeredPipelineChartQuery({
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
    const client = createInstillAxiosClient(accessToken, "core");
    const pipelinesChart: PipelinesChart[] = [];

    const queryString = getQueryString({
      baseURL: `/metrics/vdp/pipeline/charts`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } = await client.get<ListPipelinesChartResponse>(queryString);
    pipelinesChart.push(...data.pipeline_trigger_chart_records);

    return Promise.resolve(pipelinesChart);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetUsersSubscription = {
  subscription: {
    plan: string;
    quota: {
      private_pipeline_trigger: {
        quota: number;
        used: number;
        remain: number;
      };
    };
  };
};

export async function getUsersSubscription({
  userName,
  accessToken,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetUsersSubscription>(
      `/users/${userName}/subscription`
    );

    return Promise.resolve(data.subscription);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getOrganizationsSubscription({
  oraganizationName,
  accessToken,
}: {
  oraganizationName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetUsersSubscription>(
      `/organizations/${oraganizationName}/subscription`
    );

    return Promise.resolve(data.subscription);
  } catch (err) {
    return Promise.reject(err);
  }
}
