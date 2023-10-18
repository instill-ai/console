import { useQuery } from "@tanstack/react-query";
import { listPipelinesQuery, listUserPipelinesQuery } from "../../vdp-sdk";
import { env } from "../../utility";
import type { Nullable } from "../../type";

export async function fetchUserPipelines(
  userName: string,
  accessToken: Nullable<string>
) {
  try {
    if (!accessToken) {
      return Promise.reject(new Error("accessToken not provided"));
    }

    const pipelines = await listUserPipelinesQuery({
      userName,
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      nextPageToken: null,
      accessToken,
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
}: {
  userName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
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

  return useQuery(
    ["pipelines", userName],
    async () => {
      if (!userName) {
        return Promise.reject(new Error("userName not provided"));
      }

      const pipelines = await fetchUserPipelines(userName, accessToken);
      return Promise.resolve(pipelines);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
