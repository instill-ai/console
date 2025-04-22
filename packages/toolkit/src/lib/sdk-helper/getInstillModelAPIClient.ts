import { GeneralRecord, InstillAPIClient, Nullable } from "instill-sdk";

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

    let userProvidedAdditionalHeaders: GeneralRecord | undefined;

    if (
      env("NEXT_PUBLIC_CF_ACCESS_CLIENT_ID") &&
      env("NEXT_PUBLIC_CF_ACCESS_CLIENT_SECRET")
    ) {
      userProvidedAdditionalHeaders = {
        "CF-Access-Client-Id": env("NEXT_PUBLIC_CF_ACCESS_CLIENT_ID"),
        "CF-Access-Client-Secret": env("NEXT_PUBLIC_CF_ACCESS_CLIENT_SECRET"),
      };
    }

    instillModelAPIClient = new InstillAPIClient({
      baseURL,
      apiToken: accessToken,
      userProvidedAdditionalHeaders,
    });
  }

  return instillModelAPIClient;
}
