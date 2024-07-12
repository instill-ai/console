import { InstillAPIClient } from "instill-sdk";

import { env } from "../../server";
import { Nullable } from "../type";

export * from "./connector";
export * from "./helper";
export * from "./metric";
export * from "./hub";
export * from "./mgmt";
export * from "./model";
export * from "./operation";
export * from "./organization";
export * from "./pipeline";
export * from "./types";

export * from "./helper";

let instillAPIClient: Nullable<InstillAPIClient> = null;

export function getInstillAPIClient({
  accessToken,
}: {
  accessToken: string;
}): InstillAPIClient {
  if (!instillAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_GENERAL_API_VERSION")}`;

    instillAPIClient = new InstillAPIClient({
      baseURL,
      apiToken: accessToken,
    });
  }

  return instillAPIClient;
}
