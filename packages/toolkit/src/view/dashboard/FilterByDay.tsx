"use client";

import * as React from "react";
import cn from "clsx";

import { Button, Icons, SelectOption } from "@instill-ai/design-system";

import { dashboardOptions } from "../../lib";

export type FilterProps = {
  setSelectedTimeOption: React.Dispatch<React.SetStateAction<SelectOption>>;
  selectedTimeOption: SelectOption;
  refetch: () => void;
};

export const FilterByDay = ({
  refetch,
  selectedTimeOption,
  setSelectedTimeOption,
}: FilterProps) => {
  return (
    <div className="flex flex-row-reverse space-x-4 space-x-reverse">
      <div className="border-semantic flex items-start justify-start">
        {dashboardOptions.timeLine.map((timeLineOption) => (
          <button
            key={timeLineOption.value}
            className={cn(
              "my-auto flex !h-10 cursor-pointer items-center justify-center self-stretch !px-4 !py-1 outline outline-1 outline-semantic-bg-line first:rounded-l-sm last:rounded-r-sm hover:bg-semantic-bg-secondary",
              timeLineOption.value === selectedTimeOption?.value
                ? "bg-semantic-bg-line"
                : "bg-white",
            )}
            onClick={() => {
              setSelectedTimeOption(timeLineOption);
            }}
          >
            <p className="text-semantic-fg-primary product-body-text-4-semibold">
              {timeLineOption.label}
            </p>
          </button>
        ))}
      </div>
      <Button
        className="my-auto h-10 w-10 !p-3"
        variant="secondaryGrey"
        size="sm"
        onClick={() => refetch()}
      >
        <Icons.RefreshCw05 className="h-4 w-4 stroke-semantic-fg-primary" />
      </Button>
    </div>
  );
};
