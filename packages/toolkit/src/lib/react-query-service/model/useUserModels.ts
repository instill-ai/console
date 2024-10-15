import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { listUserModelsQuery, Visibility } from "../../vdp-sdk";

export async function fetchUserModels(
  userName: string,
  accessToken: Nullable<string>,
  filter: Nullable<string>,
  visibility: Nullable<Visibility>,
) {
  try {
    const models = await listUserModelsQuery({
      userName,
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      nextPageToken: null,
      accessToken,
      enablePagination: false,
      filter,
      visibility,
    });

    return Promise.resolve(models);
  } catch (err) {
    return Promise.reject(err);
  }
}

export const useUserModels = ({
  userName,
  enabled,
  accessToken,
  filter,
  visibility,
}: {
  userName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}) => {
  let enableQuery = false;

  if (userName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["models", userName],
    queryFn: async () => {
      if (!userName) {
        return Promise.reject(new Error("userName not provided"));
      }

      const models = await fetchUserModels(
        userName,
        accessToken,
        filter,
        visibility,
      );
      return Promise.resolve(models);
    },
    enabled: enableQuery,
  });
};
