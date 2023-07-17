import { timeLineOptions } from "@/lib/dashboard";
import { Button, Icons, SingleSelectOption } from "@instill-ai/design-system";
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
      <div className="border-semantic flex items-start justify-start">
        {timeLineOptions.map((timeLineOption) => (
          <div
            key={timeLineOption.value}
            className={cn(
              "flex cursor-pointer items-center justify-center self-stretch px-4 py-3 outline outline-1 outline-semantic-bg-line first:rounded-l-sm last:rounded-r-sm hover:bg-semantic-bg-secondary",
              timeLineOption.value === selectedTimeOption?.value
                ? "bg-semantic-bg-line"
                : "bg-white"
            )}
            onClick={() => {
              setSelectedTimeOption(timeLineOption);
            }}
          >
            <div className="text-semantic-fg-primary product-body-text-4-semibold">
              {timeLineOption.label}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="table border-collapse">
        <div className="table-row">
          {timeLineOptions.map((timeLineOption) => (
            <Button
              className="!box-border !rounded-none !border-none outline outline-1 outline-semantic-bg-line hover:!outline-semantic-fg-secondary"
              variant="secondaryGrey"
              size="sm"
              onClick={() => refetch()}
            >
              <div className="text-semantic-fg-primary product-body-text-4-semibold">
                {timeLineOption.label}
              </div>
            </Button>
          ))}
        </div>
      </div> */}
      <Button
        className="my-auto !p-2"
        variant="secondaryGrey"
        size="sm"
        onClick={() => refetch()}
      >
        <Icons.RefreshCw05 className="h-4 w-4 stroke-semantic-fg-primary" />
      </Button>
    </div>
  );
};
