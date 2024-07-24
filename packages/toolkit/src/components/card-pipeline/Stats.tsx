"use client";

import { Icons } from "@instill-ai/design-system";

import { convertLongNumberToK } from "../../lib";
import { getHumanReadableStringFromTime } from "../../server";

export type StatsProps = {
  runCount: number;
  updatedAt: string;
  cloneCount: number;
};

export const Stats = (props: StatsProps) => {
  const { updatedAt, runCount, cloneCount } = props;

  return (
    <div className="mt-auto flex w-full flex-row items-center gap-x-4">
      <div className="flex flex-row items-center gap-x-1 text-sm uppercase text-semantic-fg-secondary">
        <Icons.Rocket01 className="h-4 w-4 stroke-semantic-fg-primary" />
        {convertLongNumberToK(runCount)} Run{runCount !== 1 ? "s" : ""}
      </div>
      <div className="flex flex-row items-center gap-x-1 text-sm uppercase text-semantic-fg-secondary">
        <Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-primary" />
        {convertLongNumberToK(cloneCount)} Clone{cloneCount !== 1 ? "s" : ""}
      </div>
      <div className="ml-auto text-sm text-semantic-fg-disabled">
        Updated {getHumanReadableStringFromTime(updatedAt, Date.now())}
      </div>
    </div>
  );
};
