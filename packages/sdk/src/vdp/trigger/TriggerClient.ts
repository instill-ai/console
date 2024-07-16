import { getInstillAdditionalHeaders } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  TriggerAsyncNamespacePipelineReleaseRequest,
  TriggerAsyncNamespacePipelineReleaseResponse,
  TriggerAsyncNamespacePipelineRequest,
  TriggerAsyncNamespacePipelineResponse,
  TriggerNamespacePipelineReleaseRequest,
  TriggerNamespacePipelineReleaseResponse,
  TriggerNamespacePipelineRequest,
  TriggerNamespacePipelineResponse,
} from "./types";

export class TriggerClient extends APIResource {
  async triggerNamespacePipeline({
    namespacePipelineName,
    inputs,
    requesterUid,
    returnTraces,
    shareCode,
  }: TriggerNamespacePipelineRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
      shareCode,
    });

    try {
      const data = this._client.post<TriggerNamespacePipelineResponse>(
        `/${namespacePipelineName}/trigger`,
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
  }: TriggerNamespacePipelineReleaseRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
      returnTraces,
      shareCode,
    });

    try {
      const data =
        await this._client.post<TriggerNamespacePipelineReleaseResponse>(
          `/${namespacePipelineReleaseName}/trigger`,
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
