import {
  CreditClient,
  MetricClient,
  OrganizationClient,
  SubscriptionClient,
  TokenClient,
  UserClient,
  UtilsClient,
} from "../core";
import { ModelClient } from "../model";
import { GeneralRecord, HttpMethod } from "../types";
import { ComponentClient, PipelineClient, ArtifactClient } from "../vdp";
import { ReleaseClient } from "../vdp/release";
import { SecretClient } from "../vdp/secret";
import { TriggerClient } from "../vdp/trigger";

export type RequestOption = {
  body?: string;
  additionalHeaders?: GeneralRecord;
};

export class InstillAPIClient {
  baseURL: string;
  apiToken: string | undefined;

  constructor({ baseURL, apiToken }: { baseURL: string; apiToken?: string }) {
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
        headers: this.apiToken
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiToken}`,
              ...opt?.additionalHeaders,
            }
          : {
              "Content-Type": "application/json",
              ...opt?.additionalHeaders,
            },
        body: opt?.body,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
      }

      if (method === "DELETE") {
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
    artifact: new ArtifactClient(this),
    release: new ReleaseClient(this),
    trigger: new TriggerClient(this),
    secret: new SecretClient(this),
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

  model = new ModelClient(this);
}

export class instillArtifactAPIClient {
  baseURL: string;
  apiToken: string | undefined;

  constructor({ baseURL, apiToken }: { baseURL: string; apiToken?: string }) {
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
        headers: this.apiToken
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiToken}`,
              ...opt?.additionalHeaders,
            }
          : {
              "Content-Type": "application/json",
              ...opt?.additionalHeaders,
            },
        body: opt?.body,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
      }

      if (method === "DELETE") {
        return Promise.resolve() as Promise<Rsp>;
      }

      const data = (await response.json()) satisfies Rsp;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  artifact = {
    // knowledgeBase: new KnowledgeBaseClient(this),
    // chunk: new ChunkClient(this),
  };
}
