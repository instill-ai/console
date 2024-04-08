import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getUserConnectorQuery } from "../../../vdp-sdk";

export async function fetchUserConnector({
  connectorName,
  accessToken,
}: {
  connectorName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    if (!connectorName) {
      return Promise.reject(new Error("connectorName not provided"));
    }

    const model = await getUserConnectorQuery({ connectorName, accessToken });

    return Promise.resolve(model);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseUserConnectorQueryKey(connectorName: Nullable<string>) {
  return ["connectors", connectorName];
}

export function prefetchUserConnector({
  connectorName,
  accessToken,
  queryClient,
}: {
  connectorName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseUserConnectorQueryKey(connectorName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchUserConnector({
        connectorName,
        accessToken,
      });
    },
  });
}
