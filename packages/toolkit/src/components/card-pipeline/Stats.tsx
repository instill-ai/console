"use client";

import { Icons } from "@instill-ai/design-system";

import { convertLongNumberToK } from "../../lib";
import { getHumanReadableStringFromTime } from "../../server";

export type StatsProps = {
  runCount: number;
  updatedAt: string;
};

export const Stats = (props: StatsProps) => {
  const { updatedAt, runCount } = props;

  return (
    <div className="mt-auto flex w-full flex-row items-center gap-x-4">
      <div className="flex flex-row items-center gap-x-1 uppercase text-semantic-fg-secondary font-medium text-sm">
        <Icons.Rocket01 className="w-4 h-4 stroke-semantic-fg-primary" />
        {runCount ? convertLongNumberToK(runCount) : 0} Run
        {runCount !== 1 ? "s" : ""}
      </div>
      <div className="ml-auto product-body-text-3-regular text-semantic-node-connector-off">
        Updated {getHumanReadableStringFromTime(updatedAt, Date.now())}
      </div>
    </div>
  );
};
