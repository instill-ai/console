import { useQuery } from "@tanstack/react-query";
import { ResourceView } from "instill-sdk";

import type { Nullable } from "../../type";
import { getInstillModelAPIClient } from "../../vdp-sdk";

export function useLastModelTriggerResult({
  modelId,
  userId,
  accessToken,
  enabled,
  view = "VIEW_BASIC",
  retry,
  requesterUid,
}: {
  modelId: Nullable<string>;
  userId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view?: ResourceView;
  retry?: false | number;
  requesterUid?: string;
}) {
  let enableQuery = false;
  const queryKey = ["models", "operation", requesterUid];

  if (modelId && enabled) {
    enableQuery = true;

    queryKey.push(modelId);
    queryKey.push(view);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!modelId) {
        return Promise.reject(new Error("Model id not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const operation = await client.model.getNamespaceModelOperationResult({
        namespaceModelName: `namespaces/${userId}/models/${modelId}`,
        view,
        requesterUid,
      });

      return Promise.resolve(operation);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
