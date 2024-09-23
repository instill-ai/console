"use client";

import { getModelInstanceTaskToolkit, Icons, Tag } from "@instill-ai/design-system";

import { convertLongNumberToK, ModelTask } from "../../lib";
import { getHumanReadableStringFromTime } from "../../server";

export type StatsProps = {
  task: ModelTask;
  runCount?: number;
  updatedAt: string;
};

export const Stats = (props: StatsProps) => {
  const { task, updatedAt, runCount } = props;
  const { label, getIcon } = getModelInstanceTaskToolkit(task);

  return (
    <div className="mt-auto flex w-full flex-row items-center gap-x-4">
      <Tag variant="lightPurple">
        <div className="flex flex-row items-center gap-x-1 uppercase product-body-text-4-medium">
          {getIcon("w-4 h-4 stroke-semantic-secondary-hover")}
          {label}
        </div>
      </Tag>
      <div className="flex flex-row items-center gap-x-1 uppercase text-semantic-fg-secondary font-medium">
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
