"use client";

import type { Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { queryKeyStore } from "../queryKeyStore";

export function onTriggerInvalidateCredits({
  namespaceId,
  namespaceIds,
  queryClient,
}: {
  namespaceId: Nullable<string>;
  namespaceIds: string[];
  queryClient: QueryClient;
}) {
  const ownerInstillCreditQueryKey =
    queryKeyStore.mgmt.getUseGetNamespaceRemainingInstillCreditQueryKey({
      namespaceId,
    });
  const namespacesInstillCreditQueryKey =
    queryKeyStore.mgmt.getUseListNamespacesRemainingInstillCreditQueryKey({
      namespaceIds,
    });

  queryClient.invalidateQueries({ queryKey: ownerInstillCreditQueryKey });
  queryClient.invalidateQueries({
    queryKey: namespacesInstillCreditQueryKey,
  });
}
