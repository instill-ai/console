import { InstillAPIClient } from "instill-sdk";

import { env } from "../../server";
import { Nullable } from "../type";

export * from "./helper";
export * from "./metric";
export * from "./mgmt";
export * from "./model";
export * from "./operation";
export * from "./organization";
export * from "./types";

export * from "./helper";

let instillAPIClient: Nullable<InstillAPIClient> = null;
let instillModelAPIClient: Nullable<InstillAPIClient> = null;
let instillApplicationAPIClient: Nullable<InstillAPIClient> = null;

export function getInstillAPIClient({ accessToken }: { accessToken?: string }) {
  if (!instillAPIClient) {
    const baseURL = `${process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
      }/${env("NEXT_PUBLIC_GENERAL_API_VERSION")}`;

    instillAPIClient = new InstillAPIClient({
      baseURL,

      // When non logged in user is viewing some pages, accessToken will be null
      apiToken: accessToken,
    });
  }

  return instillAPIClient;
}

export function getInstillModelAPIClient({
  accessToken,
}: {
  accessToken?: string;
}) {
  if (!instillModelAPIClient) {
    const baseURL = `${process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
      }/${env("NEXT_PUBLIC_MODEL_API_VERSION")}`;

    instillModelAPIClient = new InstillAPIClient({
      baseURL,

      // When non logged in user is viewing some pages, accessToken will be null
      apiToken: accessToken,
    });
  }

  return instillModelAPIClient;
}

export function getInstillApplicationAPIClient({ accessToken }: { accessToken?: string }) {
  if (!instillApplicationAPIClient) {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'https://api-d0.instill-inc.tech';
    const apiVersion = process.env.NEXT_PUBLIC_APPLICATION_API_VERSION || 'v1alpha';

    const baseURL = `${apiGatewayUrl}/${apiVersion}`;

    instillApplicationAPIClient = new InstillAPIClient({
      baseURL,
      apiToken: accessToken,
    });
  }

  return instillApplicationAPIClient;
}