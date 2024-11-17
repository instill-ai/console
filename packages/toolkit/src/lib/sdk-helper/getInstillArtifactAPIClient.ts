import { InstillAPIClient, Nullable } from "instill-sdk";

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

    instillArtifactAPIClient = new InstillAPIClient({
      baseURL,
      apiToken: accessToken,
    });
  }

  return instillArtifactAPIClient;
}
