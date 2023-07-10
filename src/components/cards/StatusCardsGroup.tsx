import cn from "clsx";
import { StatusCard } from "./StatusCard";
import { Status } from "@/types";
import { Fragment } from "react";
import { SkeletonCell } from "@instill-ai/toolkit";
import { Skeleton } from "../skeleton";

export type StatusCardsGroupProps = {
  statusStats: Status[];
  type: "pipeline" | "model";
  isLoading: boolean;
};

export const StatusCardsGroup = (props: StatusCardsGroupProps) => {
  const { statusStats, type, isLoading } = props;

  return (
    <Fragment>
      <div
        className={cn(
          "grid grid-cols-1 gap-y-[20px] md:grid-cols-3 md:gap-x-[20px]"
        )}
      >
        {isLoading ? (
          [Array(2).keys()].map((e) => (
            <div
              key={`cards-skeleton-${e}`}
              className="MetricItem inline-flex flex-col items-start justify-start gap-2 rounded-sm border border-slate-200 bg-white p-6 shadow"
            >
              <div className="Heading self-stretch text-[14px] font-medium leading-tight text-gray-800 text-opacity-80">
                <Skeleton width="w-35" hight="h-5" />
              </div>
              <div className="NumberAndBadge inline-flex items-end justify-start gap-4 self-stretch">
                <div className="Number shrink grow basis-0 text-[28px] font-bold leading-loose text-gray-800">
                  <Skeleton width="w-16" hight="h-11" />
                </div>
                <Skeleton width="w-8" hight="h-5" />
              </div>
            </div>
          ))
        ) : (
          <>
            {statusStats.map((data) => (
              <StatusCard
                key={`${data.type}-${data.statusname}`}
                type={type}
                statusname={data.statusname}
                amount={data.amount}
                change={data.change}
              />
            ))}
          </>
        )}
      </div>
    </Fragment>
  );
};
