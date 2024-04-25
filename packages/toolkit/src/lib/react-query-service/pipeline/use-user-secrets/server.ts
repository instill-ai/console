import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { listUserSecretsQuery } from "../../../vdp-sdk";
import { env } from "../../../../server";

export async function fetchUserSecrets({
  entityName,
  accessToken,
  pageSize,
}: {
  entityName: Nullable<string>;
  accessToken: Nullable<string>;
  pageSize?: number;
}) {
  try {
    if (!entityName) {
      throw new Error("entityName not provided");
    }

    const userSecrets = await listUserSecretsQuery({
      pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      entityName,
      accessToken,
      nextPageToken: null,
    });

    return Promise.resolve(userSecrets);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseUserSecretsQueryKey(entityName: Nullable<string>) {
  return ["secrets", entityName];
}

export function prefetchUserSecrets({
  entityName,
  accessToken,
  queryClient,
}: {
  entityName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseUserSecretsQueryKey(entityName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchUserSecrets({
        entityName,
        accessToken,
      });
    },
  });
}
