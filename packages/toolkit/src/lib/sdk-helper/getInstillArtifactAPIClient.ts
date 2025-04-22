import { GeneralRecord, InstillAPIClient, Nullable } from "instill-sdk";

import { env } from "../../server";

let instillArtifactAPIClient: Nullable<InstillAPIClient> = null;

export function getInstillArtifactAPIClient({
  accessToken,
}: {
  accessToken?: string;
}) {
  if (!instillArtifactAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_ARTIFACT_API_VERSION")}`;

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

    instillArtifactAPIClient = new InstillAPIClient({
      baseURL,
      apiToken: accessToken,
      userProvidedAdditionalHeaders,
    });
  }

  return instillArtifactAPIClient;
}
