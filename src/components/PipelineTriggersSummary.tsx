import { PipelineTriggersStatusSummaryItem } from "@/types";
import { Icons, Skeleton, Tag } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";
import { Fragment, ReactNode } from "react";

const PipelineTriggersSummaryCard = (props: {
  summary: Nullable<PipelineTriggersStatusSummaryItem>;
}) => {
  if (!props.summary) {
    return (
      <div
        key={`cards-skeleton`}
        className="inline-flex h-[108px] w-[246] flex-col items-start justify-start gap-2 rounded-sm border border-semantic-bg-line bg-white p-6 shadow"
      >
        <div className="self-stretch">
          <Skeleton className="h-5 w-full rounded" />
        </div>
        <div className="self-stretch">
          <Skeleton className="h-8 w-full rounded" />
        </div>
      </div>
    );
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
    <div className="inline-flex flex-col items-start justify-start gap-2 rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-6 shadow">
      <div className="self-stretch text-semantic-fg-secondary product-body-text-3-medium">
        {summaryName}
      </div>
      <div className="inline-flex items-end justify-start gap-4 self-stretch">
        <div className="mr-auto text-semantic-fg-primary product-headings-heading-1">
          {amount}
        </div>
        <div className="my-auto flex items-center justify-center">
          {statusType === "STATUS_ERRORED" ? (
            <Tag variant="lightRed" size="sm" className="gap-x-2 border-0">
              <Icons.ArrowDown className="h-4 w-4 stroke-semantic-error-default" />
              {`${delta} %`}
            </Tag>
          ) : null}
          {statusType === "STATUS_COMPLETED" ? (
            <Tag variant="lightGreen" size="sm" className="gap-x-2 border-0">
              <Icons.ArrowUp className="h-4 w-4 stroke-semantic-success-default" />
              {`${delta} %`}
            </Tag>
          ) : null}
        </div>
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
      <div className="grid w-[516px] grid-cols-2 gap-x-6">{children}</div>
    </Fragment>
  );
};
PipelineTriggersSummary.Card = PipelineTriggersSummaryCard;
