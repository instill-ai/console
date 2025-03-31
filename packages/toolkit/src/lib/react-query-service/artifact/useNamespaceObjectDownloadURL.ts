import { useQuery } from "@tanstack/react-query";
import {
  GetNamespaceObjectDownloadURLRequest,
  WithNullableFields,
} from "instill-sdk";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { QueryBaseProps } from "../types";

export function useNamespaceObjectDownloadURL({
  objectUid,
  namespaceId,
  enabled,
  accessToken,
  urlExpireDays,
}: WithNullableFields<GetNamespaceObjectDownloadURLRequest> & QueryBaseProps) {
  return useQuery({
    queryKey: [namespaceId, "namespace-object-download-url", objectUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!objectUid) {
        throw new Error("objectUid is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const response = await client.artifact.getNamespaceObjectDownloadURL({
        namespaceId,
        objectUid,
        urlExpireDays: urlExpireDays ?? undefined,
      });

      return response;
    },
    enabled,
  });
}
