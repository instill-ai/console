import { timeLineOptions } from "@/lib/dashboard";
import { Icons, SingleSelectOption } from "@instill-ai/design-system";
import { QueryObserverResult } from "@tanstack/react-query";
import React from "react";
import cn from "clsx";

export type FilterProps = {
  setSelectedTimeOption: React.Dispatch<
    React.SetStateAction<SingleSelectOption>
  >;
  selectedTimeOption: SingleSelectOption;
  refetch: QueryObserverResult["refetch"];
};

export const FilterByDay = ({
  refetch,
  selectedTimeOption,
  setSelectedTimeOption,
}: FilterProps) => {
  return (
    <div className="flex flex-row-reverse space-x-4 space-x-reverse">
      <div className="ButtonGroup flex items-start justify-start gap-[1px] border border-slate-200 bg-slate-200">
        {timeLineOptions.map((timeLineOption) => (
          <div
            key={timeLineOption.value}
            className={cn(
              `Button flex w-[75px] cursor-pointer items-center justify-center gap-1 self-stretch ${
                timeLineOption.value === selectedTimeOption?.value
                  ? "bg-slate-200"
                  : "bg-white"
              } px-2 py-1`
            )}
            onClick={() => {
              setSelectedTimeOption(timeLineOption);
            }}
          >
            <div className="Label text-center text-[12px] font-semibold leading-none text-gray-800">
              {timeLineOption.label}
            </div>
          </div>
        ))}
      </div>

      <div
        className="IconButton flex cursor-pointer items-center justify-center rounded border border-slate-200 bg-white p-2"
        onClick={() => refetch()}
      >
        <Icons.RefreshCw05 className="h-4 w-4 stroke-semantic-fg-primary" />
      </div>
    </div>
  );
};
