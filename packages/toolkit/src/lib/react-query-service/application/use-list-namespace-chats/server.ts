import type { InstillAPIClient, Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getInstillApplicationAPIClient } from "../../../sdk-helper";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchNamespaceChats({
  namespaceId,
  accessToken,
  initialClient,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  initialClient?: Nullable<InstillAPIClient>;
}) {
  if (!namespaceId) {
    throw new Error("namespaceId is required");
  }

  try {
    const client = initialClient
      ? initialClient
      : getInstillApplicationAPIClient({
          accessToken: accessToken ?? undefined,
        });

    const chats = await client.application.listNamespaceChats({
      namespaceId,
    });

    return Promise.resolve(chats);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function prefetchNamespacePipeline({
  namespaceId,
  accessToken,
  queryClient,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.application.getUseListNamespaceChatsQueryKey({
      namespaceId,
    }),

    queryFn: async () => {
      return await fetchNamespaceChats({
        namespaceId,
        accessToken,
      });
    },
  });
}
