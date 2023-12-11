import { Nullable } from "../../lib";
import SemiCircleProgress from "./SemiCircleProgress";
import React from "react";
import { Button, Icons } from "@instill-ai/design-system";
import { type } from "os";

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
};

export default function RemainingTriggers({
  subscriptions,
}: RemainingTriggersProps) {
  const getPercentange = (subscription: Subscription) => {
    const alpha =
      (subscription?.quota?.pipeline_trigger.used /
        subscription?.quota?.pipeline_trigger.quota) *
      100;

    return Math.round(alpha);
  };

  const getSubscriptionMessage = (percentage: number) => {
    console.log("percentage", percentage);

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
        <p className=" mb-2 product-body-text-3-medium">Remaining Triggers</p>

        <p className="product-body-text-4-regular">
          {subscriptions &&
            getSubscriptionMessage(getPercentange(subscriptions))}
        </p>
      </div>

      <div className="flex w-[130px] flex-col items-center justify-center">
        <SemiCircleProgress
          percentage={subscriptions ? getPercentange(subscriptions) : 0}
          showPercentValue={true}
          stroke={"#316FED"}
          diameter={100}
          strokeWidth={6}
        />
        <Button variant="secondaryGrey" size="sm" className="mt-4 gap-x-2">
          <Icons.Lightning01 className="font-size-[24px] h-3 w-3 stroke-slate-800" />
          Upgrade plan
        </Button>
      </div>
    </div>
  );
}
