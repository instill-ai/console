import { QueryClient } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getUseNamespacesRemainingCreditQueryKey } from "./useNamespacesRemainingCredit";
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
  const ownerCreditQueryKey = getUseRemainingCreditQueryKey(ownerName);
  const namespacesCreditQueryKey =
    getUseNamespacesRemainingCreditQueryKey(namespaceNames);

  queryClient.invalidateQueries({ queryKey: ownerCreditQueryKey });
  queryClient.invalidateQueries({ queryKey: namespacesCreditQueryKey });
}
