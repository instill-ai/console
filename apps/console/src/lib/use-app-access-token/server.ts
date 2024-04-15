import {
  QueryClient,
  authValidateTokenAction,
} from "@instill-ai/toolkit/server";
import axios from "axios";

export async function fetchAccessToken() {
  try {
    const { data } = await axios.get("/api/access-token");

    const accessToken = data.access_token;

    if (!accessToken) {
      throw new Error("No accessToken in response");
    }

    await authValidateTokenAction({ accessToken });

    return Promise.resolve(accessToken as string);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUserAccessTokenQueryKey() {
  return ["accessToken"];
}

export function prefetchAccessToken({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  const queryKey = getUserAccessTokenQueryKey();

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchAccessToken();
    },
  });
}
