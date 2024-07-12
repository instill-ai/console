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
    input,
    requesterUid,
    returnTraces,
    shareCode,
  }: TriggerNamespacePipelineRequest) {
    try {
      const data = this._client.post<TriggerNamespacePipelineResponse>(
        `/${namespacePipelineName}/trigger`,
        {
          body: JSON.stringify({ input }),
          additionalHeaders: {
            "instill-return-traces": returnTraces ? "true" : "false",
            "instill-share-code": shareCode,
            "Access-Control-Allow-Headers":
              "instill-return-traces, instill-share-code, Instill-Requester-Uid",
            "Content-Type": "application/json",
            "Instill-Requester-Uid": requesterUid,
          },
        },
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async triggerAsyncNamespacePipeline({
    namespacePipelineName,
    input,
    returnTraces,
    requesterUid,
    shareCode,
  }: TriggerAsyncNamespacePipelineRequest) {
    try {
      const data =
        await this._client.post<TriggerAsyncNamespacePipelineResponse>(
          `/${namespacePipelineName}/triggerAsync`,
          {
            body: JSON.stringify({ input }),
            additionalHeaders: {
              "instill-return-traces": returnTraces ? "true" : "false",
              "instill-share-code": shareCode,
              "Access-Control-Allow-Headers":
                "instill-return-traces, instill-share-code, Instill-Requester-Uid",
              "Content-Type": "application/json",
              "Instill-Requester-Uid": requesterUid,
            },
          },
        );
      return Promise.resolve(data.operation);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async triggerNamespacePipelineRelease({
    namespacePipelineReleaseName,
    input,
    returnTraces,
    requesterUid,
    shareCode,
  }: TriggerNamespacePipelineReleaseRequest) {
    try {
      const data =
        await this._client.post<TriggerNamespacePipelineReleaseResponse>(
          `/${namespacePipelineReleaseName}/trigger`,
          {
            body: JSON.stringify({ input }),
            additionalHeaders: {
              "instill-return-traces": returnTraces ? "true" : "false",
              "instill-share-code": shareCode,
              "Access-Control-Allow-Headers":
                "instill-return-traces, instill-share-code, Instill-Requester-Uid",
              "Content-Type": "application/json",
              "Instill-Requester-Uid": requesterUid,
            },
          },
        );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async triggerAsyncNamespacePipelineRelease({
    namespacePipelineReleaseName,
    input,
    returnTraces,
    requesterUid,
    shareCode,
  }: TriggerAsyncNamespacePipelineReleaseRequest) {
    try {
      const data =
        await this._client.post<TriggerAsyncNamespacePipelineReleaseResponse>(
          `/${namespacePipelineReleaseName}/triggerAsync`,
          {
            body: JSON.stringify({ input }),
            additionalHeaders: {
              "instill-return-traces": returnTraces ? "true" : "false",
              "instill-share-code": shareCode,
              "Access-Control-Allow-Headers":
                "instill-return-traces, instill-share-code, Instill-Requester-Uid",
              "Content-Type": "application/json",
              "Instill-Requester-Uid": requesterUid,
            },
          },
        );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
