import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getUserModelQuery } from "../../../vdp-sdk";

export async function fetchUserModel({
  modelName,
  accessToken,
}: {
  modelName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    if (!modelName) {
      return Promise.reject(new Error("modelName not provided"));
    }

    const model = await getUserModelQuery({ modelName, accessToken });

    return Promise.resolve(model);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseUserModelQueryKey(modelName: Nullable<string>) {
  return ["models", modelName];
}

export function prefetchUserModel({
  modelName,
  accessToken,
  queryClient,
}: {
  modelName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseUserModelQueryKey(modelName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchUserModel({
        modelName,
        accessToken,
      });
    },
  });
}
