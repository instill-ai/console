import { PipelineTriggersStatusSummaryItem } from "@/types";
import { Icons, Tag } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";
import { Fragment, ReactNode } from "react";

const PipelineTriggersSummaryCard = (props: {
  summary: Nullable<PipelineTriggersStatusSummaryItem>;
}) => {
  if (!props.summary) {
    return <></>;
  }

  const {
    summary: { statusType, delta, amount },
  } = props;

  let summaryName: Nullable<string> = null;

  switch (statusType) {
    case "STATUS_COMPLETED": {
      summaryName = "Completed Triggers";
      break;
    }
    case "STATUS_ERRORED": {
      summaryName = "Error Triggers";
      break;
    }
    default: {
      summaryName = "Unspecific Triggers";
    }
  }

  return (
    <div className="inline-flex flex-col items-start justify-start gap-2 rounded-sm border border-slate-200 bg-white p-6 shadow">
      <div className="self-stretch text-[14px] font-medium leading-tight text-gray-800 text-opacity-80">
        {summaryName}
      </div>
      <div className="inline-flex items-end justify-start gap-4 self-stretch">
        <div className="shrink grow basis-0 text-[28px] font-bold leading-loose text-gray-800">
          {amount}
        </div>
        {statusType === "STATUS_ERRORED" ? (
          <Tag variant="lightRed" size="sm" className="gap-x-2">
            <Icons.ArrowDown className="h-4 w-4 stroke-semantic-error-default" />
            {`${delta} %`}
          </Tag>
        ) : null}
        {statusType === "STATUS_COMPLETED" ? (
          <Tag variant="lightGreen" size="sm" className="gap-x-2">
            <Icons.ArrowUp className="h-4 w-4 stroke-semantic-success-default" />
            {`${delta} %`}
          </Tag>
        ) : null}
      </div>
    </div>
  );
};

export type PipelineTriggersSummaryProps = {
  children: ReactNode;
};

export const PipelineTriggersSummary = (
  props: PipelineTriggersSummaryProps
) => {
  const { children } = props;

  return (
    <Fragment>
      <div className="grid grid-cols-2 gap-y-[20px] md:grid-cols-2 md:gap-x-[20px]">
        {children}
      </div>
    </Fragment>
  );
};
PipelineTriggersSummary.Card = PipelineTriggersSummaryCard;
