/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ListPaginatedNamespacePipelineComponentRunsRequest,
  ListPaginatedNamespacePipelineComponentRunsResponse,
  ListPaginatedNamespacePipelineRunsRequest,
  ListPaginatedNamespacePipelineRunsResponse,
  TriggerAsyncNamespacePipelineReleaseRequest,
  TriggerAsyncNamespacePipelineReleaseResponse,
  TriggerAsyncNamespacePipelineRequest,
  TriggerAsyncNamespacePipelineResponse,
  TriggerNamespacePipelineReleaseRequest,
  TriggerNamespacePipelineReleaseResponse,
  TriggerNamespacePipelineReleaseWithStreamResponse,
  TriggerNamespacePipelineRequest,
  TriggerNamespacePipelineResponse,
  TriggerNamespacePipelineWithStreamResponse,
} from "./types";
import { getInstillAdditionalHeaders, getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";

export class TriggerClient extends APIResource {
  async listPaginatedNamespacePipelineRuns(
    props: ListPaginatedNamespacePipelineRunsRequest,
  ) {
    const {
      namespaceId,
      pipelineId,
      view,
      pageSize,
      page,
      orderBy,
      filter,
      requesterId,
    } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/pipelines/${pipelineId}/runs`,
        pageSize,
        page,
        filter,
        orderBy,
        view,
      });

      const additionalHeaders = getInstillAdditionalHeaders({ requesterId });

      const data =
        await this._client.get<ListPaginatedNamespacePipelineRunsResponse>(
          queryString,
          {
            additionalHeaders,
          },
        );

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async listPaginatedNamespacePipelineComponentRuns(
    props: ListPaginatedNamespacePipelineComponentRunsRequest,
  ) {
    const {
      namespaceId,
      pipelineId,
      pipelineRunId,
      view,
      pageSize,
      page,
      orderBy,
      filter,
      requesterId,
    } = props;

    try {
      const additionalHeaders = getInstillAdditionalHeaders({ requesterId });

      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/pipelines/${pipelineId}/runs/${pipelineRunId}/component-runs`,
        pageSize,
        page,
        filter,
        orderBy,
        view,
      });

      const data =
        await this._client.get<ListPaginatedNamespacePipelineComponentRunsResponse>(
          queryString,
          {
            additionalHeaders,
          },
        );

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async triggerNamespacePipeline({
    namespaceId,
    pipelineId,
    inputs,
    returnTraces,
    requesterId,
    shareCode,
    stream,
  }: TriggerNamespacePipelineRequest & {
    stream: true;
  }): Promise<TriggerNamespacePipelineWithStreamResponse>;
  async triggerNamespacePipeline({
    namespaceId,
    pipelineId,
    inputs,
    returnTraces,
    requesterId,
    shareCode,
    stream,
  }: TriggerNamespacePipelineRequest & {
    stream: false;
  }): Promise<TriggerNamespacePipelineResponse>;
  async triggerNamespacePipeline({
    namespaceId,
    pipelineId,
    inputs,
    returnTraces,
    requesterId,
    shareCode,
    stream,
  }: TriggerNamespacePipelineRequest & {
    stream?: undefined;
  }): Promise<TriggerNamespacePipelineResponse>;
  async triggerNamespacePipeline({
    namespaceId,
    pipelineId,
    inputs,
    returnTraces,
    requesterId,
    shareCode,
    stream,
  }: TriggerNamespacePipelineRequest & {
    stream?: boolean;
  }): Promise<
    | TriggerNamespacePipelineResponse
    | TriggerNamespacePipelineWithStreamResponse
  >;
  async triggerNamespacePipeline({
    namespaceId,
    pipelineId,
    inputs,
    requesterId,
    returnTraces,
    shareCode,
    stream,
    isConsole,
  }: TriggerNamespacePipelineRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterId,
      returnTraces,
      shareCode,
      stream,
      isConsole,
    });

    try {
      const data = (await this._client.post(
        `/namespaces/${namespaceId}/pipelines/${pipelineId}/trigger`,
        {
          body: JSON.stringify({ inputs }),
          additionalHeaders,
          stream,
        },
      )) as any;

      if (stream) {
        return Promise.resolve(
          data,
        ) as Promise<TriggerNamespacePipelineWithStreamResponse>;
      } else {
        return Promise.resolve(data);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async triggerAsyncNamespacePipeline({
    namespaceId,
    pipelineId,
    inputs,
    returnTraces,
    requesterId,
    shareCode,
  }: TriggerAsyncNamespacePipelineRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterId,
      returnTraces,
      shareCode,
    });

    try {
      const data =
        await this._client.post<TriggerAsyncNamespacePipelineResponse>(
          `/namespaces/${namespaceId}/pipelines/${pipelineId}/trigger-async`,
          {
            body: JSON.stringify({ inputs }),
            additionalHeaders,
          },
        );
      return Promise.resolve(data.operation);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async triggerNamespacePipelineRelease({
    namespaceId,
    pipelineId,
    releaseId,
    inputs,
    returnTraces,
    requesterId,
    shareCode,
    stream,
    isConsole,
  }: TriggerNamespacePipelineReleaseRequest & {
    stream?: boolean;
    isConsole?: boolean;
  }) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterId,
      returnTraces,
      shareCode,
      stream,
      isConsole,
    });

    try {
      const data =
        await this._client.post<TriggerNamespacePipelineReleaseResponse>(
          `/namespaces/${namespaceId}/pipelines/${pipelineId}/releases/${releaseId}/trigger`,
          {
            body: JSON.stringify({ inputs }),
            additionalHeaders,
            stream,
          },
        );

      if (stream) {
        return Promise.resolve(
          data,
        ) as Promise<TriggerNamespacePipelineReleaseWithStreamResponse>;
      } else {
        return Promise.resolve(data);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async triggerAsyncNamespacePipelineRelease({
    namespaceId,
    pipelineId,
    releaseId,
    inputs,
    returnTraces,
    requesterId,
    shareCode,
  }: TriggerAsyncNamespacePipelineReleaseRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterId,
      returnTraces,
      shareCode,
    });

    try {
      const data =
        await this._client.post<TriggerAsyncNamespacePipelineReleaseResponse>(
          `/namespaces/${namespaceId}/pipelines/${pipelineId}/releases/${releaseId}/trigger-async`,
          {
            body: JSON.stringify({ inputs }),
            additionalHeaders,
          },
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
