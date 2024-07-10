import fetch from "isomorphic-unfetch";

import {
  CreditClient,
  MetricClient,
  OrganizationClient,
  SubscriptionClient,
  TokenClient,
  UserClient,
  UtilsClient,
} from "../core";
import { GeneralRecord, HttpMethod } from "../types";
import { ComponentClient, PipelineClient } from "../vdp";

export type RequestOption = {
  body?: string;
  additionalHeaders?: GeneralRecord;
};

export class InstillAPIClient {
  baseURL: string;
  apiToken: string;

  constructor({ baseURL, apiToken }: { baseURL: string; apiToken: string }) {
    this.baseURL = baseURL;
    this.apiToken = apiToken;
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
    try {
      const response = await fetch(`${this.baseURL}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiToken}`,
          ...opt?.additionalHeaders,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
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
  };

  core = {
    metric: new MetricClient(this),
    user: new UserClient(this),
    organization: new OrganizationClient(this),
    token: new TokenClient(this),
    subscription: new SubscriptionClient(this),
    credit: new CreditClient(this),
    utils: new UtilsClient(this),
  };
}
