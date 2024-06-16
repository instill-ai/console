import { Nullable } from "../../../type";
import { createInstillAxiosClient, getQueryString } from "../../helper";
import {
  PipelineTriggerRecord,
  PipelinesChart,
  TriggeredPipeline,
} from "./types";

export type ListPipelineTriggerRecordsResponse = {
  pipelineTriggerRecords: PipelineTriggerRecord[];
  nextPageToken: string;
  totalSize: number;
};

export type ListTriggeredPipelinesResponse = {
  pipelineTriggerTableRecords: TriggeredPipeline[];
  nextPageToken: string;
  totalSize: number;
};

export type ListPipelinesChartResponse = {
  pipelineTriggerChartRecords: PipelinesChart[];
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
    const client = createInstillAxiosClient(accessToken);
    const triggers: PipelineTriggerRecord[] = [];

    const queryString = getQueryString({
      baseURL: `/metrics/vdp/pipeline/triggers`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } =
      await client.get<ListPipelineTriggerRecordsResponse>(queryString);

    triggers.push(...data.pipelineTriggerRecords);

    if (data.nextPageToken) {
      triggers.push(
        ...(await listPipelineTriggerRecordsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.nextPageToken,
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
    const client = createInstillAxiosClient(accessToken);
    const pipelines: TriggeredPipeline[] = [];

    const queryString = getQueryString({
      baseURL: `/metrics/vdp/pipeline/tables`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } =
      await client.get<ListTriggeredPipelinesResponse>(queryString);

    pipelines.push(...data.pipelineTriggerTableRecords);

    if (data.nextPageToken) {
      pipelines.push(
        ...(await listTriggeredPipelineQuery({
          pageSize,
          accessToken,
          nextPageToken: data.nextPageToken,
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
    const client = createInstillAxiosClient(accessToken);
    const pipelinesChart: PipelinesChart[] = [];

    const queryString = getQueryString({
      baseURL: `/metrics/vdp/pipeline/charts`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } = await client.get<ListPipelinesChartResponse>(queryString);
    pipelinesChart.push(...data.pipelineTriggerChartRecords);

    return Promise.resolve(pipelinesChart);
  } catch (err) {
    return Promise.reject(err);
  }
}
