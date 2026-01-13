import "whatwg-fetch";

import { ArtifactClient } from "../artifact";
import {
  IntegrationClient,
  MetricClient,
  SubscriptionClient,
  TokenClient,
  UserClient,
  UtilsClient,
} from "../core";
import { ModelClient } from "../model";
import { GeneralRecord, HttpMethod, InstillError } from "../types";
import {
  ComponentClient,
  PipelineClient,
  ReleaseClient,
  SecretClient,
  TriggerClient,
} from "../vdp";

export type RequestOption = {
  body?: string | Blob | File;
  additionalHeaders?: GeneralRecord;
  stream?: boolean;
  isFullPath?: boolean;
  isVoidReturn?: boolean;
  isBlob?: boolean;
};

export class InstillAPIClient {
  baseURL: string;
  apiToken: string | undefined;
  debug: boolean | undefined;
  userProvidedAdditionalHeaders: GeneralRecord | undefined;

  constructor({
    baseURL,
    apiToken,
    debug,
    userProvidedAdditionalHeaders,
  }: {
    baseURL: string;
    apiToken?: string;
    debug?: boolean;
    userProvidedAdditionalHeaders?: GeneralRecord;
  }) {
    this.baseURL = baseURL;
    this.apiToken = apiToken;
    this.debug = debug;
    this.userProvidedAdditionalHeaders = userProvidedAdditionalHeaders;
  }

  async get<Rsp>(path: string, opt?: RequestOption): Promise<Rsp> {
    return this.makeMethodRequest("GET", path, opt);
  }

  async post<Rsp>(path: string, opt?: RequestOption): Promise<Rsp> {
    return this.makeMethodRequest("POST", path, opt);
  }

  async put<Rsp>(path: string, opt?: RequestOption): Promise<Rsp> {
    return this.makeMethodRequest("PUT", path, opt);
  }

  async patch<Rsp>(path: string, opt?: RequestOption): Promise<Rsp> {
    return this.makeMethodRequest("PATCH", path, opt);
  }

  async delete<Rsp>(path: string, opt?: RequestOption): Promise<Rsp> {
    return this.makeMethodRequest("DELETE", path, opt);
  }

  private async makeMethodRequest<Rsp>(
    method: HttpMethod,
    path: string,
    opt?: RequestOption,
  ): Promise<Rsp> {
    const requestPath = opt?.isFullPath ? path : `${this.baseURL}${path}`;

    try {
      const response = await fetch(requestPath, {
        method,
        headers: this.apiToken
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiToken}`,
              ...opt?.additionalHeaders,
              ...this.userProvidedAdditionalHeaders,
            }
          : {
              "Content-Type": "application/json",
              ...opt?.additionalHeaders,
              ...this.userProvidedAdditionalHeaders,
            },
        body: opt?.body,
      });

      if (opt && opt.stream) {
        return response as Rsp;
      }

      if (opt && opt.isBlob) {
        return response as Rsp;
      }

      if (!response.ok) {
        if (this.debug) {
          console.error(response);
        }

        if (response.status === 404) {
          return Promise.reject(new InstillError("Not Found", 404));
        }

        const error = await response.json();
        return Promise.reject(
          new InstillError(error.message, response.status, error),
        );
      }

      if (method === "DELETE" || opt?.isVoidReturn) {
        return Promise.resolve() as Promise<Rsp>;
      }

      const data = (await response.json()) satisfies Rsp;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  vdp = {
    component: new ComponentClient(this),
    pipeline: new PipelineClient(this),
    release: new ReleaseClient(this),
    trigger: new TriggerClient(this),
    secret: new SecretClient(this),
  };

  // NOTE: organization and membership clients are EE-only (available in console-ee)
  core = {
    metric: new MetricClient(this),
    user: new UserClient(this),
    token: new TokenClient(this),
    subscription: new SubscriptionClient(this),
    utils: new UtilsClient(this),
    integration: new IntegrationClient(this),
  };

  model = new ModelClient(this);
  artifact = new ArtifactClient(this);
}
