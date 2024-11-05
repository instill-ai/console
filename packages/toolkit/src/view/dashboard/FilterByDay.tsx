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
    <div className="flex flex-row space-x-4 items-center">
      <div className="h-10 bg-semantic-bg-secondary p-1 rounded-sm flex items-center space-x-1 border-semantic-bg-line border">
        {dashboardOptions.timeLine.map((timeLineOption) => (
          <button
            key={timeLineOption.value}
            className={cn(
              "flex items-center justify-center h-8 px-4 py-2 rounded transition-all duration-200 ease-in-out product-body-text-3-semibold",
              timeLineOption.value === selectedTimeOption?.value
                ? "bg-semantic-bg-primary shadow text-semantic-fg-primary"
                : "bg-transparent text-semantic-fg-disabled hover:bg-semantic-bg-line",
            )}
            onClick={() => {
              setSelectedTimeOption(timeLineOption);
            }}
          >
            {timeLineOption.label}
          </button>
        ))}
      </div>
      <Button
        className="my-auto !h-10 !w-10"
        variant="secondaryGrey"
        size="sm"
        onClick={() => refetch()}
      >
        <Icons.RefreshCw05 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
      </Button>
    </div>
  );
};
