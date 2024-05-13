"use client";

import { Icons, getModelInstanceTaskToolkit } from "@instill-ai/design-system";
//import { convertLongNumberToK } from "../../lib/convertLongNumberToK";
import { ModelTask } from "../../lib";
import { getHumanReadableStringFromTime } from "../../server";

export type StatsProps = {
  task: ModelTask;
  runCount?: number;
  updatedAt: string;
};

export const Stats = (props: StatsProps) => {
  const { task, updatedAt /* , runCount */ } = props;
  const { label, getIcon } = getModelInstanceTaskToolkit(task);

  return (
    <div className="mt-auto flex w-full flex-row items-center gap-x-4">
      <div className="flex flex-row items-center gap-x-1 uppercase text-semantic-fg-secondary">
        {getIcon("w-4 h-4 stroke-semantic-fg-primary")}
        {label}
      </div>
      {
        //TODO: uncomment when the run count is available from BE
        /* <div className="flex flex-row items-center gap-x-1 uppercase text-semantic-fg-secondary">
        <Icons.Rocket01 className="w-4 h-4 stroke-semantic-fg-primary" />
        {convertLongNumberToK(2500)} Runs
      </div> */
      }
      <div className="ml-auto text-sm text-semantic-fg-disabled">
        Updated {getHumanReadableStringFromTime(updatedAt, Date.now())}
      </div>
    </div>
  );
};
