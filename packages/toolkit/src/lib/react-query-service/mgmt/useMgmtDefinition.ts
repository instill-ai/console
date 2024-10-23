"use client";

import { useQuery } from "@tanstack/react-query";

import { listRepoFileContent } from "../../github";

export function useMgmtDefinition({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: ["mgmt", "encoded-definition"],
    queryFn: async () => {
      const { content } = await listRepoFileContent(
        "instill-ai",
        "mgmt-backend",
        "config/models/user.json",
      );

      const decode = window.atob(content);
      return Promise.resolve(decode);
    },
    enabled: enabled,
  });
}
