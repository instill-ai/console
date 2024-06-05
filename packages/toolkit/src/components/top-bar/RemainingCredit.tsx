"use client";

import { Button, Skeleton } from "@instill-ai/design-system";
import {
  InstillStore,
  useAuthenticatedUser,
  useAuthenticatedUserSubscription,
  useInstillStore,
  useRemainingCredit,
  useShallow,
} from "../../lib";
import { useRouter } from "next/navigation";
import { env } from "../../server";

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

  const remainingCredit = useRemainingCredit({
    ownerName: me.isSuccess ? me.data.name : null,
    accessToken,
    enabled:
      enabledQuery && me.isSuccess && env("NEXT_PUBLIC_APP_ENV") === "CLOUD",
  });

  const sub = useAuthenticatedUserSubscription({
    enabled: me.isSuccess && enabledQuery,
    accessToken,
  });

  return (
    <div className="flex w-full flex-row gap-x-2 rounded-sm bg-semantic-bg-base-bg px-3 py-4">
      {remainingCredit.isSuccess ? (
        <p className="my-auto font-mono text-[11px] font-medium text-[#344054]">{`${remainingCredit.data.toLocaleString("en-US", { style: "decimal" })} credits left`}</p>
      ) : (
        <Skeleton className="my-auto h-5 w-[100px] rounded" />
      )}
      {sub.isSuccess && sub.data.detail?.status === "STATUS_ACTIVE" ? null : (
        <Button
          variant="tertiaryColour"
          onClick={() => {
            router.push(ctaTargetHref);
          }}
          className="ml-auto"
          size="md"
        >
          Upgrade
        </Button>
      )}
    </div>
  );
};
