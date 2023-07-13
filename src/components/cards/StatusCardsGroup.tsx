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
                <Skeleton
                  width="w-full"
                  hight="h-8"
                  animationClassname="rounded"
                />
              </div>
              <div className="my-1 self-stretch">
                <Skeleton
                  width="w-full"
                  hight="h-8"
                  animationClassname="rounded"
                />
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
