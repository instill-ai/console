"use client";

import type { Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getUseNamespacesRemainingInstillCreditQueryKey } from ".";
import { getUseRemainingCreditQueryKey } from "./useRemainingCredit";

export function onTriggerInvalidateCredits({
  ownerName,
  namespaceNames,
  queryClient,
}: {
  ownerName: Nullable<string>;
  namespaceNames: string[];
  queryClient: QueryClient;
}) {
  const ownerInstillCreditQueryKey = getUseRemainingCreditQueryKey(ownerName);
  const namespacesInstillCreditQueryKey =
    getUseNamespacesRemainingInstillCreditQueryKey(namespaceNames);

  queryClient.invalidateQueries({ queryKey: ownerInstillCreditQueryKey });
  queryClient.invalidateQueries({
    queryKey: namespacesInstillCreditQueryKey,
  });
}
