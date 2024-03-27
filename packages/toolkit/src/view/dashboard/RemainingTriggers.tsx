"use client";

import { Nullable, User } from "../../lib";
import SemiCircleProgress from "./SemiCircleProgress";
import { Button, Icons, Skeleton } from "@instill-ai/design-system";
import Link from "next/link";

export type Subscription = {
  plan: string;
  quota: {
    private_pipeline_trigger: {
      quota: number;
      used: number;
      remain: number;
    };
  };
};

export type RemainingTriggersProps = {
  subscriptions: Nullable<Subscription>;
  user: Nullable<User>;
};

export default function RemainingTriggers({
  subscriptions,
  user,
}: RemainingTriggersProps) {
  const getPercentange = (subscription: Nullable<Subscription>) => {
    if (!subscription) {
      return 0;
    }

    // A safe guard to the -1 value
    if (subscription.quota.private_pipeline_trigger.quota === -1) {
      return 100;
    }

    let alpha = 0;
    if (
      subscription?.quota?.private_pipeline_trigger?.used &&
      subscription?.quota?.private_pipeline_trigger?.quota
    ) {
      alpha =
        (subscription?.quota?.private_pipeline_trigger?.used /
          subscription?.quota?.private_pipeline_trigger?.quota) *
        100;
    }

    if (subscription?.quota?.private_pipeline_trigger?.used === 0) {
      alpha = 100;
    }
    if (subscription?.quota?.private_pipeline_trigger?.quota === 0) {
      return 0;
    }

    return Math.round(alpha);
  };

  // Currently, we don't need this warning
  // const getSubscriptionMessage = (percentage: number) => {
  //   if (percentage === 100) {
  //     return `You haven't used any triggers yet. Upgrade your plan to unlock the power of automated pipelines.`;
  //   }
  //   if (percentage === 0) {
  //     return `You have used all triggers in your plan. Upgrade now to avoid disruption on your AI workflows.`;
  //   }
  //   if (percentage <= 25) {
  //     return `You've used ${percentage}% of your available triggers. Consider upgrading your plan to keep your workflows running seamlessly.`;
  //   }
  //   if (percentage <= 50) {
  //     return `You've used ${percentage}% of your available triggers. Upgrade your plan for uninterrupted workflow automation.`;
  //   }
  //   if (percentage <= 80) {
  //     return `You've used ${percentage}% of your available triggers. Upgrade plan to trigger more pipelines.`;
  //   }
  // };

  return (
    <div className="flex h-[110px] w-[362px] flex-row rounded-sm border border-semantic-bg-line bg-semantic-bg-primary bg-white p-6 px-5 py-3 shadow">
      <div className="my-auto w-2/3">
        <p className="mb-auto text-semantic-fg-secondary product-body-text-3-medium">
          Remaining Private Triggers
        </p>

        {subscriptions ? (
          <p className="text-semantic-fg-secondary product-body-text-4-regular">
            {`${subscriptions.quota.private_pipeline_trigger.remain} private triggers remaining (${subscriptions.quota.private_pipeline_trigger.quota} total)`}
          </p>
        ) : null}
      </div>

      <div className="flex w-[130px] flex-col items-center justify-center">
        <SemiCircleProgress
          percentage={getPercentange(subscriptions ? subscriptions : null)}
          showPercentValue={true}
          stroke={
            getPercentange(subscriptions ? subscriptions : null) === 0
              ? "#E02E3D"
              : "#316FED"
          }
          background={
            getPercentange(subscriptions ? subscriptions : null) === 0
              ? "#E02E3D"
              : "#D0D0CE"
          }
          diameter={100}
          strokeWidth={6}
        />

        {user ? (
          <Link href={`/settings/billing`}>
            <Button variant="secondaryGrey" size="sm" className="mt-4 gap-x-2">
              <Icons.Lightning01 className="h-3 w-3 stroke-semantic-fg-primary" />
              Upgrade plan
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

const RemainingTriggersSkeleton = () => {
  return (
    <div className="inline-flex h-[110px] w-[362px] flex-col items-start justify-start gap-2 rounded-sm border border-semantic-bg-line bg-white p-6 shadow">
      <div className="self-stretch">
        <Skeleton className="h-5 w-full rounded" />
      </div>
      <div className="self-stretch">
        <Skeleton className="h-8 w-full rounded" />
      </div>
    </div>
  );
};

RemainingTriggers.Skeleton = RemainingTriggersSkeleton;
