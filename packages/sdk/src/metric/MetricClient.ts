import { APIResource } from "../core/resource";
import { getQueryString } from "../helper";
import {
  ListCreditConsumptionChartRecordResponse,
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
    owner,
    start,
    stop,
    aggregationWindow,
  }: {
    owner: string;
    start?: string;
    stop?: string;
    aggregationWindow?: string;
  }) {
    try {
      const queryString = getQueryString({
        baseURL: `/metrics/credit/charts`,
        owner,
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
      enablePagination: boolean;
    },
  ): Promise<ListPipelineTriggersResponse | PipelineTriggerRecord[]>;
  async listPipelineTriggers(
    props: ListPipelineTriggerRequest & {
      enablePagination: boolean;
    },
  ) {
    const { pageSize, nextPageToken, filter, enablePagination } = props;

    try {
      const triggers: PipelineTriggerRecord[] = [];

      const queryString = getQueryString({
        baseURL: `/metrics/vdp/pipeline/triggers`,
        pageSize,
        nextPageToken,
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
            nextPageToken: data.nextPageToken,
            filter,
            enablePagination,
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
      enablePagination: boolean;
    },
  ): Promise<ListPipelineTriggerMetricResponse | PipelineTriggerTableRecord[]>;
  async listPipelineTriggerMetric(
    props: ListPipelineTriggerMetricRequest & {
      enablePagination: boolean;
    },
  ) {
    const { pageSize, nextPageToken, filter, enablePagination } = props;

    const pipelineTriggerTableRecords: PipelineTriggerTableRecord[] = [];

    try {
      const queryString = getQueryString({
        baseURL: `/metrics/vdp/pipeline/tables`,
        pageSize,
        nextPageToken,
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
            nextPageToken: data.nextPageToken,
            filter,
            enablePagination,
          })),
        );
      }

      return Promise.resolve(pipelineTriggerTableRecords);
    } catch (error) {}
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
    const { pageSize, nextPageToken, filter } = props;

    const pipelineTriggerChartRecords: PipelineTriggerChartRecord[] = [];

    try {
      const queryString = getQueryString({
        baseURL: `/metrics/vdp/pipeline/charts`,
        pageSize,
        nextPageToken,
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
