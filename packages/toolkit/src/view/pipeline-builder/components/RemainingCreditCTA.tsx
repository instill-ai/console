"use client";

import { useRouter } from "next/navigation";

import { Button, Skeleton } from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUser,
  useGetNamespaceRemainingInstillCredit,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { env } from "../../../server";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const RemainingCreditCTA = ({
  ctaTargetHref,
}: {
  ctaTargetHref: string;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const remainingCredit = useGetNamespaceRemainingInstillCredit({
    namespaceId: me.isSuccess ? me.data.id : null,
    accessToken,
    enabled:
      enabledQuery && me.isSuccess && env("NEXT_PUBLIC_APP_ENV") === "CLOUD",
  });

  return (
    <div className="flex w-[232px] flex-row gap-x-2 rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-2">
      {remainingCredit.isSuccess ? (
        <p className="my-auto font-mono text-[11px] font-medium text-[#344054]">{`${remainingCredit.data.total.toLocaleString("en-US", { style: "decimal" })} credits left`}</p>
      ) : (
        <Skeleton className="my-auto h-5 w-[100px] rounded" />
      )}
      <Button
        variant="primary"
        onClick={() => {
          router.push(ctaTargetHref);
        }}
        className="ml-auto"
        size="md"
      >
        Upgrade
      </Button>
    </div>
  );
};
