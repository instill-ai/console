import { useQuery } from "@tanstack/react-query";
import { Visibility, listUserPipelinesQuery } from "../../vdp-sdk";
import { env } from "../../utility";
import type { Nullable } from "../../type";

// This is a public API, we won't block unauth users from accessing this

export async function fetchUserPipelines(
  userName: string,
  accessToken: Nullable<string>,
  filter: Nullable<string>,
  visibility: Nullable<Visibility>
) {
  try {
    const pipelines = await listUserPipelinesQuery({
      userName,
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      nextPageToken: null,
      accessToken,
      enablePagination: false,
      filter,
      visibility,
    });

    return Promise.resolve(pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
}

export const useUserPipelines = ({
  userName,
  enabled,
  accessToken,
  retry,
  filter,
  visibility,
}: {
  userName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (userName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["pipelines", userName],
    queryFn: async () => {
      if (!userName) {
        return Promise.reject(new Error("userName not provided"));
      }

      const pipelines = await fetchUserPipelines(
        userName,
        accessToken,
        filter,
        visibility
      );
      return Promise.resolve(pipelines);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
};
