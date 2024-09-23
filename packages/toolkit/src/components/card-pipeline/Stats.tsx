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
      <div className="flex flex-row items-center gap-x-1 text-sm uppercase text-semantic-fg-secondary font-medium">
        <Icons.Zap className="h-4 w-4 stroke-semantic-fg-primary" />
        {convertLongNumberToK(runCount)} triggered
      </div>
      <div className="ml-auto text-sm text-semantic-fg-disabled">
        Updated {getHumanReadableStringFromTime(updatedAt, Date.now())}
      </div>
    </div>
  );
};
