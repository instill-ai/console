import cn from "clsx";
import { StatusCard } from "./StatusCard";
import { StatusCount } from "@/types";
import { Fragment } from "react";
import { Skeleton } from "@instill-ai/design-system";

export type StatusCardsGroupProps = {
  statusStats: StatusCount;
  type: "pipeline" | "model";
  isLoading: boolean;
};

export const StatusCardsGroup = (props: StatusCardsGroupProps) => {
  const { statusStats, type, isLoading } = props;

  return (
    <Fragment>
      <div
        className={cn(
          "grid grid-cols-2 gap-y-[20px] md:grid-cols-2 md:gap-x-[20px]"
        )}
      >
        {isLoading ? (
          [...Array(2).keys()].map((e) => (
            <div
              key={`cards-skeleton-${e}`}
              className="inline-flex h-32 flex-col items-start justify-start gap-2 rounded-sm border border-slate-200 bg-white p-6 shadow"
            >
              <div className="self-stretch">
                <Skeleton className="h-8 w-full rounded" />
              </div>
              <div className="my-1 self-stretch">
                <Skeleton className="h-8 w-full rounded" />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatusCard
              key={`${statusStats.completed.type}-${statusStats.completed.state}`}
              type={type}
              state={statusStats.completed.state}
              amount={statusStats.completed.amount}
              change={statusStats.completed.change}
            />
            <StatusCard
              key={`${statusStats.errored.type}-${statusStats.errored.state}`}
              type={type}
              state={statusStats.errored.state}
              amount={statusStats.errored.amount}
              change={statusStats.errored.change}
            />
          </>
        )}
      </div>
    </Fragment>
  );
};
