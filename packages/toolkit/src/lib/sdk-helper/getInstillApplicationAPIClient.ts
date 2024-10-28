import { InstillAPIClient, Nullable } from "instill-sdk";

import { env } from "../../server";

let instillApplicationAPIClient: Nullable<InstillAPIClient> = null;

export function getInstillApplicationAPIClient({
  accessToken,
}: {
  accessToken?: string;
}) {
  if (!instillApplicationAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_APPLICATION_API_VERSION")}`;

    instillApplicationAPIClient = new InstillAPIClient({
      baseURL,
      apiToken: accessToken,
    });
  }

  return instillApplicationAPIClient;
}
