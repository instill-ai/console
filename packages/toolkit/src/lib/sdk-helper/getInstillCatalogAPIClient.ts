import { InstillAPIClient, Nullable } from "instill-sdk";

import { env } from "../../server";

let instillCatalogAPIClient: Nullable<InstillAPIClient> = null;

export function getInstillCatalogAPIClient({
    accessToken,
}: {
    accessToken?: string;
}) {
    if (!instillCatalogAPIClient) {
        const baseURL = `${process.env.NEXT_SERVER_API_GATEWAY_URL ??
            env("NEXT_PUBLIC_API_GATEWAY_URL")
            }/${env("NEXT_PUBLIC_APPLICATION_API_VERSION")}`;

        instillCatalogAPIClient = new InstillAPIClient({
            baseURL,
            apiToken: accessToken,
        });
    }

    return instillCatalogAPIClient;
}
