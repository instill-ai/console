"use client";

import { Fragment, ReactNode } from "react";
import { Icons, Skeleton, Tag } from "@instill-ai/design-system";
import { Nullable, PipelineTriggersStatusSummaryItem } from "../../../lib";

const ModelTriggersSummaryCard = (props: {
  summary: Nullable<PipelineTriggersStatusSummaryItem>;
}) => {
  if (!props.summary) {
    return (
      <div
        key={`cards-skeleton`}
        className="inline-flex h-[110px] w-[246] flex-col items-start justify-start gap-2 rounded-sm border border-semantic-bg-line bg-semantic-bg-alt-primary p-6"
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
    <div className="inline-flex flex-col items-start justify-start gap-2 rounded-sm border border-semantic-bg-line bg-semantic-bg-alt-primary p-[8px_12px_8px_12px]">
      <div className="self-stretch text-semantic-fg-secondary product-label-label-1">
        {summaryName}
      </div>
      <div className="inline-flex items-end justify-start gap-4 self-stretch">
        <div className="mr-auto text-semantic-fg-primary product-body-text-2-semibold">
          {amount}
        </div>
        <div className="my-auto flex items-center justify-center">
          {delta < 0 ? (
            <Tag variant="lightRed" size="sm" className="gap-x-2 border-0">
              <Icons.ArrowDown className="h-4 w-4 stroke-semantic-error-default" />
              {`${delta} %`}
            </Tag>
          ) : null}
          {delta > 0 ? (
            <Tag variant="lightGreen" size="sm" className="gap-x-2 border-0">
              <Icons.ArrowUp className="h-4 w-4 stroke-semantic-success-default" />
              {`${delta} %`}
            </Tag>
          ) : null}
          {delta === 0 ? (
            <Tag size="sm" className="px-3">{`${delta} %`}</Tag>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export type ModelTriggersSummaryProps = {
  children: ReactNode;
};

export const ModelTriggersSummary = (
  props: ModelTriggersSummaryProps
) => {
  const { children } = props;

  return (
    <Fragment>
      <div className="grid w-[816px] grid-cols-3 gap-x-6">{children}</div>
    </Fragment>
  );
};

ModelTriggersSummary.Card = ModelTriggersSummaryCard;