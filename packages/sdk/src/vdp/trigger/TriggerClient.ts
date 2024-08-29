/* eslint-disable @typescript-eslint/no-explicit-any */

import { getInstillAdditionalHeaders } from "../../helper";
import { APIResource } from "../../main/resource";
import {
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

export class TriggerClient extends APIResource {
  async triggerNamespacePipeline({
    namespacePipelineName,
    inputs,
    returnTraces,
    requesterUid,
    shareCode,
    stream,
  }: TriggerNamespacePipelineRequest & {
    stream: true;
  }): Promise<TriggerNamespacePipelineWithStreamResponse>;
  async triggerNamespacePipeline({
    namespacePipelineName,
    inputs,
    returnTraces,
    requesterUid,
    shareCode,
    stream,
  }: TriggerNamespacePipelineRequest & {
    stream: false;
  }): Promise<TriggerNamespacePipelineResponse>;
  async triggerNamespacePipeline({
    namespacePipelineName,
    inputs,
    returnTraces,
    requesterUid,
    shareCode,
    stream,
  }: TriggerNamespacePipelineRequest & {
    stream?: undefined;
  }): Promise<TriggerNamespacePipelineResponse>;
  async triggerNamespacePipeline({
    namespacePipelineName,
    inputs,
    returnTraces,
    requesterUid,
    shareCode,
    stream,
  }: TriggerNamespacePipelineRequest & {
    stream?: boolean;
  }): Promise<
    | TriggerNamespacePipelineResponse
    | TriggerNamespacePipelineWithStreamResponse
  >;
  async triggerNamespacePipeline({
    namespacePipelineName,
    inputs,
    requesterUid,
    returnTraces,
    shareCode,
    stream,
    isConsole,
  }: TriggerNamespacePipelineRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
      shareCode,
      stream,
      isConsole,
    });

    try {
      const data = (await this._client.post(
        `/${namespacePipelineName}/trigger`,
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
    namespacePipelineName,
    inputs,
    returnTraces,
    requesterUid,
    shareCode,
  }: TriggerAsyncNamespacePipelineRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
      shareCode,
    });

    try {
      const data =
        await this._client.post<TriggerAsyncNamespacePipelineResponse>(
          `/${namespacePipelineName}/triggerAsync`,
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
    namespacePipelineReleaseName,
    inputs,
    returnTraces,
    requesterUid,
    shareCode,
    stream,
    isConsole,
  }: TriggerNamespacePipelineReleaseRequest & {
    stream?: boolean;
    isConsole?: boolean;
  }) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
      shareCode,
      stream,
      isConsole,
    });

    try {
      const data =
        await this._client.post<TriggerNamespacePipelineReleaseResponse>(
          `/${namespacePipelineReleaseName}/trigger`,
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

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async triggerAsyncNamespacePipelineRelease({
    namespacePipelineReleaseName,
    inputs,
    returnTraces,
    requesterUid,
    shareCode,
  }: TriggerAsyncNamespacePipelineReleaseRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
      shareCode,
    });

    try {
      const data =
        await this._client.post<TriggerAsyncNamespacePipelineReleaseResponse>(
          `/${namespacePipelineReleaseName}/triggerAsync`,
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
