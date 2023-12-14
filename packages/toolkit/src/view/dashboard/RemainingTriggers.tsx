import { Nullable, User, useUser } from "../../lib";
import SemiCircleProgress from "./SemiCircleProgress";
import React from "react";
import { Button, Icons } from "@instill-ai/design-system";
import Link from "next/link";

export type Subscription = {
  plan: string;
  quota: {
    pipeline_trigger: {
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

    let alpha: number = 0;
    if (
      subscription?.quota?.pipeline_trigger?.used &&
      subscription?.quota?.pipeline_trigger?.quota
    ) {
      alpha =
        (subscription?.quota?.pipeline_trigger?.used /
          subscription?.quota?.pipeline_trigger?.quota) *
        100;
    }

    if (subscription?.quota?.pipeline_trigger?.used === 0) {
      alpha = 100;
    }
    if (subscription?.quota?.pipeline_trigger?.quota === 0) {
      return 0;
    }

    return Math.round(alpha);
  };

  const getSubscriptionMessage = (percentage: number) => {
    if (percentage === 100) {
      return `You haven't used any triggers yet. Upgrade your plan to unlock the power of automated pipelines.`;
    }
    if (percentage === 0) {
      return `You have used all triggers in your plan. Upgrade now to avoid disruption on your AI workflows.`;
    }
    if (percentage <= 25) {
      return `You've used ${percentage}% of your available triggers. Consider upgrading your plan to keep your workflows running seamlessly.`;
    }
    if (percentage <= 50) {
      return `You've used ${percentage}% of your available triggers. Upgrade your plan for uninterrupted workflow automation.`;
    }
    if (percentage <= 80) {
      return `You've used ${percentage}% of your available triggers. Upgrade plan to trigger more pipelines.`;
    }
  };

  return (
    <div className="flex h-[110px] w-[362px] flex-row rounded-sm border border-semantic-bg-line bg-semantic-bg-primary bg-white p-6 px-5 py-3 shadow">
      <div className="my-auto w-2/3">
        <p className=" mb-2 text-semantic-fg-secondary product-body-text-3-medium">
          Remaining Triggers
        </p>

        <p className="text-semantic-fg-secondary product-body-text-4-regular">
          {getSubscriptionMessage(
            subscriptions ? getPercentange(subscriptions) : 0
          )}
        </p>
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
          <Link href={`${user.id}/settings/billing`}>
            <Button variant="secondaryGrey" size="sm" className="mt-4 gap-x-2">
              <Icons.Lightning01 className="font-size-[24px] h-3 w-3 stroke-slate-800" />
              Upgrade plan
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
