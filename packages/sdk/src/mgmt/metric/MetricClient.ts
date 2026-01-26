import { getInstillAdditionalHeaders, getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import { PipelineRun } from "../../pipeline";
import {
  ListCreditConsumptionChartRecordResponse,
  ListModelTriggerCountRequest,
  ListModelTriggerCountResponse,
  ListModelTriggerMetricRequest,
  ListModelTriggerMetricResponse,
  ListPipelineRunsByRequesterRequest,
  ListPipelineRunsByRequesterResponse,
  ListPipelineTriggerComputationTimeChartsRequest,
  ListPipelineTriggerComputationTimeChartsResponse,
  ListPipelineTriggerMetricRequest,
  ListPipelineTriggerMetricResponse,
  ListPipelineTriggerRequest,
  ListPipelineTriggersResponse,
  PipelineTriggerChartRecord,
  PipelineTriggerRecord,
  PipelineTriggerTableRecord,
} from "./types";

export class MetricClient extends APIResource {
  async listInstillCreditConsumptionTimeChart({
    namespaceId,
    start,
    stop,
    aggregationWindow,
  }: {
    namespaceId: string;
    start?: string;
    stop?: string;
    aggregationWindow?: string;
  }) {
    try {
      const queryString = getQueryString({
        baseURL: `/metrics/credit/charts`,
        namespaceId,
        start: start ?? undefined,
        stop: stop ?? undefined,
        aggregationWindow: aggregationWindow ?? undefined,
      });

      const data =
        await this._client.get<ListCreditConsumptionChartRecordResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listModelTriggerMetric(
    props: ListModelTriggerMetricRequest & {
      enablePagination?: boolean;
    },
  ) {
    const { pageSize, page, filter, enablePagination, requesterId, start } =
      props;
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterId,
    });

    try {
      const queryString = getQueryString({
        baseURL: `/model-runs/query-charts`,
        pageSize,
        page,
        filter,
        requesterId,
        start,
      });

      const response = await this._client.get<ListModelTriggerMetricResponse>(
        queryString,
        {
          additionalHeaders,
        },
      );

      if (enablePagination) {
        return Promise.resolve(response);
      }

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listModelTriggerCount(
    request: ListModelTriggerCountRequest,
  ): Promise<ListModelTriggerCountResponse> {
    const { requesterId, start, stop } = request;

    if (!requesterId) {
      return Promise.reject(new Error("requesterId is required"));
    }

    try {
      const queryString = getQueryString({
        baseURL: `/model-runs/count?`,
        requesterId,
        start: start ?? undefined,
        stop: stop ?? undefined,
      });

      const data =
        await this._client.get<ListModelTriggerCountResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPipelineRunsByRequester(
    props: ListPipelineRunsByRequesterRequest & { enablePagination: true },
  ): Promise<ListPipelineRunsByRequesterResponse>;

  async listPipelineRunsByRequester(
    props: ListPipelineRunsByRequesterRequest & { enablePagination: false },
  ): Promise<PipelineRun[]>;

  async listPipelineRunsByRequester(
    props: ListPipelineRunsByRequesterRequest & { enablePagination?: boolean },
  ): Promise<ListPipelineRunsByRequesterResponse | PipelineRun[]> {
    const { pageSize, page, orderBy, enablePagination, requesterId, start } =
      props;

    const additionalHeaders = getInstillAdditionalHeaders({
      requesterId,
    });

    try {
      const queryString = getQueryString({
        baseURL: `/dashboard/pipelines/runs`,
        pageSize,
        page,
        orderBy,
        requesterId,
        start,
      });

      const data = await this._client.get<ListPipelineRunsByRequesterResponse>(
        queryString,
        {
          additionalHeaders,
        },
      );

      if (enablePagination) {
        return Promise.resolve(data);
      }

      return Promise.resolve(data.pipelineRuns);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPipelineTriggers(
    props: ListPipelineTriggerRequest & {
      enablePagination: true;
    },
  ): Promise<ListPipelineTriggersResponse>;
  async listPipelineTriggers(
    props: ListPipelineTriggerRequest & {
      enablePagination: false;
    },
  ): Promise<PipelineTriggerRecord[]>;
  async listPipelineTriggers(
    props: ListPipelineTriggerRequest & {
      enablePagination: undefined;
    },
  ): Promise<PipelineTriggerRecord[]>;
  async listPipelineTriggers(
    props: ListPipelineTriggerRequest & {
      enablePagination?: boolean;
    },
  ): Promise<ListPipelineTriggersResponse | PipelineTriggerRecord[]>;
  async listPipelineTriggers(
    props: ListPipelineTriggerRequest & {
      enablePagination?: boolean;
    },
  ) {
    const { pageSize, pageToken, filter, enablePagination } = props;

    try {
      const triggers: PipelineTriggerRecord[] = [];

      const queryString = getQueryString({
        baseURL: `/metrics/vdp/pipeline/triggers`,
        pageSize,
        pageToken,
        filter,
      });

      const data =
        await this._client.get<ListPipelineTriggersResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      triggers.push(...data.pipelineTriggerRecords);

      if (data.nextPageToken) {
        triggers.push(
          ...(await this.listPipelineTriggers({
            pageSize,
            pageToken: data.nextPageToken,
            filter,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(triggers);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPipelineTriggerMetric(
    props: ListPipelineTriggerMetricRequest & {
      enablePagination: true;
    },
  ): Promise<ListPipelineTriggerMetricResponse>;
  async listPipelineTriggerMetric(
    props: ListPipelineTriggerMetricRequest & {
      enablePagination: false;
    },
  ): Promise<PipelineTriggerTableRecord[]>;
  async listPipelineTriggerMetric(
    props: ListPipelineTriggerMetricRequest & {
      enablePagination: undefined;
    },
  ): Promise<PipelineTriggerTableRecord[]>;
  async listPipelineTriggerMetric(
    props: ListPipelineTriggerMetricRequest & {
      enablePagination?: boolean;
    },
  ): Promise<ListPipelineTriggerMetricResponse | PipelineTriggerTableRecord[]>;
  async listPipelineTriggerMetric(
    props: ListPipelineTriggerMetricRequest & {
      enablePagination?: boolean;
    },
  ) {
    const { pageSize, pageToken, filter, enablePagination } = props;

    const pipelineTriggerTableRecords: PipelineTriggerTableRecord[] = [];

    try {
      const queryString = getQueryString({
        baseURL: `/metrics/vdp/pipeline/tables`,
        pageSize,
        pageToken,
        filter,
      });

      const data =
        await this._client.get<ListPipelineTriggerMetricResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      pipelineTriggerTableRecords.push(...data.pipelineTriggerTableRecords);

      if (data.nextPageToken) {
        pipelineTriggerTableRecords.push(
          ...(await this.listPipelineTriggerMetric({
            pageSize,
            pageToken: data.nextPageToken,
            filter,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(pipelineTriggerTableRecords);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // async listPipelineTriggerComputationTimeCharts(
  //   props: ListPipelineTriggerComputationTimeChartsRequest & {
  //     enablePagination: true;
  //   },
  // ): Promise<ListPipelineTriggerComputationTimeChartsResponse>;
  // async listPipelineTriggerComputationTimeCharts(
  //   props: ListPipelineTriggerComputationTimeChartsRequest & {
  //     enablePagination: false;
  //   },
  // ): Promise<PipelineTriggerChartRecord[]>;
  // async listPipelineTriggerComputationTimeCharts(
  //   props: ListPipelineTriggerComputationTimeChartsRequest & {
  //     enablePagination: boolean;
  //   },
  // ): Promise<
  //   | ListPipelineTriggerComputationTimeChartsResponse
  //   | PipelineTriggerChartRecord[]
  // >;
  async listPipelineTriggerComputationTimeCharts(
    props: ListPipelineTriggerComputationTimeChartsRequest,
  ) {
    const { pageSize, pageToken, filter } = props;

    const pipelineTriggerChartRecords: PipelineTriggerChartRecord[] = [];

    try {
      const queryString = getQueryString({
        baseURL: `/metrics/vdp/pipeline/charts`,
        pageSize,
        pageToken,
        filter,
      });

      const data =
        await this._client.get<ListPipelineTriggerComputationTimeChartsResponse>(
          queryString,
        );

      pipelineTriggerChartRecords.push(...data.pipelineTriggerChartRecords);
      return Promise.resolve(pipelineTriggerChartRecords);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
