import fetch from "isomorphic-unfetch";

import { ConnectorClient } from "../connector/ConnectorClient";
import { HubClient } from "../hub";
import { MetricClient } from "../metric";
import { OrganizationClient } from "../organization/OrganizationClient";
import { GeneralRecord, HttpMethod } from "../types";
import { UserClient } from "../user/UserClient";
import { APIResource } from "./resource";

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
    connector: new ConnectorClient(this),
  };

  core = {
    hub: new HubClient(this),
    metric: new MetricClient(this),
    user: new UserClient(this),
    organization: new OrganizationClient(this),
  };
}
