import { GeneralRecord, InstillAPIClient, Nullable } from "instill-sdk";

import { env } from "../../server";

let instillCatalogAPIClient: Nullable<InstillAPIClient> = null;

export function getInstillCatalogAPIClient({
  accessToken,
}: {
  accessToken?: string;
}) {
  if (!instillCatalogAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_CATALOG_API_VERSION")}`;

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

    instillCatalogAPIClient = new InstillAPIClient({
      baseURL,
      apiToken: accessToken,
      userProvidedAdditionalHeaders,
    });
  }

  return instillCatalogAPIClient;
}
