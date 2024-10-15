import { useQuery } from "@tanstack/react-query";
import { ResourceView } from "instill-sdk";

import type { Nullable } from "../../type";
import { getInstillModelAPIClient } from "../../vdp-sdk";

export function useModelVersionTriggerResult({
  modelId,
  userId,
  versionId,
  accessToken,
  enabled,
  view = "VIEW_BASIC",
  requesterUid,
}: {
  modelId: Nullable<string>;
  userId: Nullable<string>;
  versionId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view?: ResourceView;
  requesterUid?: string;
}) {
  let enableQuery = false;
  const queryKey = ["models", "operation", requesterUid];

  if (modelId && versionId && enabled) {
    enableQuery = true;

    queryKey.push(modelId);
    queryKey.push(view);
    queryKey.push(versionId);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!modelId) {
        return Promise.reject(new Error("Model id not provided"));
      }

      if (!versionId) {
        return Promise.reject(new Error("Version id not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const operation = await client.model.getNamespaceModelOperationResult({
        namespaceModelName: `namespaces/${userId}/models/${modelId}/versions/${versionId}`,
        view,
        requesterUid,
      });

      return Promise.resolve(operation);
    },
    enabled: enableQuery,
  });
}
