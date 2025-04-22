import { InstillAPIClient, Nullable } from "instill-sdk";

import { env } from "../../server";

let instillModelAPIClient: Nullable<InstillAPIClient> = null;

export function getInstillModelAPIClient({
  accessToken,
}: {
  accessToken?: string;
}) {
  if (!instillModelAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_MODEL_API_VERSION")}`;

    instillModelAPIClient = new InstillAPIClient({
      baseURL,

      // When non logged in user is viewing some pages, accessToken will be null
      apiToken: accessToken,
      userProvidedAdditionalHeaders: {
        "CF-Access-Client-Id": env("CF_ACCESS_CLIENT_ID")
          ? env("CF_ACCESS_CLIENT_ID")
          : undefined,
        "CF-Access-Client-Secret": env("CF_ACCESS_CLIENT_SECRET")
          ? env("CF_ACCESS_CLIENT_SECRET")
          : undefined,
      },
    });
  }

  return instillModelAPIClient;
}
