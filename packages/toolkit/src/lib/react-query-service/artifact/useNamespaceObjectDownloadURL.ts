import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { QueryBaseProps } from "../types";

export function useNamespaceObjectDownloadURL({
  name,
  enabled,
  accessToken,
  urlExpireDays,
  downloadFilename,
}: {
  /** Full resource name: namespaces/{namespace}/objects/{object} */
  name: Nullable<string>;
  urlExpireDays?: number;
  downloadFilename?: string;
} & QueryBaseProps) {
  return useQuery({
    queryKey: ["namespace-object-download-url", name],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!name) {
        throw new Error("name is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const response = await client.artifact.getNamespaceObjectDownloadURL({
        name,
        urlExpireDays: urlExpireDays ?? undefined,
        downloadFilename,
      });

      return response;
    },
    enabled: enabled && Boolean(name),
  });
}
