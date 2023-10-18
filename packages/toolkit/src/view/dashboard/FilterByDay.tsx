import cn from "clsx";
import * as React from "react";
import { useRouter } from "next/router";
import { Button, Icons, SingleSelectOption } from "@instill-ai/design-system";

import { dashboardOptions, env } from "../../lib";

export type FilterProps = {
  setSelectedTimeOption: React.Dispatch<
    React.SetStateAction<SingleSelectOption>
  >;
  selectedTimeOption: SingleSelectOption;
  refetch: () => void;
};

export const FilterByDay = ({
  refetch,
  selectedTimeOption,
  setSelectedTimeOption,
}: FilterProps) => {
  const router = useRouter();
  const { days } = router.query;

  React.useEffect(() => {
    if (days) {
      const timeLineOption = dashboardOptions.timeLine.find(
        (timeLineOption) => timeLineOption.value === days
      );
      if (timeLineOption) {
        setSelectedTimeOption(timeLineOption);
      }
    } else {
      setSelectedTimeOption(dashboardOptions.timeLine[0]);
    }
  }, [days, setSelectedTimeOption]);

  return (
    <div className="flex flex-row-reverse space-x-4 space-x-reverse">
      <div className="border-semantic flex items-start justify-start">
        {dashboardOptions.timeLine.map((timeLineOption) => (
          <button
            key={timeLineOption.value}
            className={cn(
              "flex cursor-pointer items-center justify-center self-stretch px-4 py-3 outline outline-1 outline-semantic-bg-line first:rounded-l-sm last:rounded-r-sm hover:bg-semantic-bg-secondary",
              timeLineOption.value === selectedTimeOption?.value
                ? "bg-semantic-bg-line"
                : "bg-white"
            )}
            onClick={() => {
              setSelectedTimeOption(timeLineOption);
              router.push({
                pathname: new URL(
                  router.asPath,
                  env("NEXT_PUBLIC_CONSOLE_BASE_URL")
                ).pathname,
                query: { days: timeLineOption.value },
              });
            }}
          >
            <div className="text-semantic-fg-primary product-body-text-4-semibold">
              {timeLineOption.label}
            </div>
          </button>
        ))}
      </div>
      <Button
        className="my-auto !p-3"
        variant="secondaryGrey"
        size="sm"
        onClick={() => refetch()}
      >
        <Icons.RefreshCw05 className="h-4 w-4 stroke-semantic-fg-primary" />
      </Button>
    </div>
  );
};
