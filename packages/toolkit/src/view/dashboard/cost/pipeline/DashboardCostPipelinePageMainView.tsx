"use client";

import * as React from "react";

import { SelectOption } from "@instill-ai/design-system";

import { useRouteInfo } from "../../../../lib";
import { UsageSwitch } from "../../UsageSwitch";
import { CostTab } from "../CostTab";

export const DashboardCostPipelinePageMainView = () => {
  const [selectedTimeOption, setSelectedTimeOption] =
    React.useState<SelectOption>({
      label: "Today",
      value: "24h",
    });

  const [activeTab, setActiveTab] = React.useState<"activity" | "cost">("cost");

  const routeInfo = useRouteInfo();

  React.useEffect(() => {
    if (!routeInfo.isSuccess) {
      return;
    }

    // if (selectedTimeOption) {
    //   const start = getTimeInRFC3339Format(
    //     selectedTimeOption.value === "24h" ? "todayStart" : selectedTimeOption.value
    //   );
    //   const stop = getTimeInRFC3339Format(
    //     selectedTimeOption?.value === "1d" ? "todayStart" : "now"
    //   );

    //   queryParams += ` AND start='${start}' AND stop='${stop}'`;
    // }

    // setQueryString(queryParams);
  }, [selectedTimeOption, routeInfo.isSuccess, routeInfo.data?.namespaceName]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-y-2">
        <h1 className="product-headings-heading-4">Usage</h1>
        <UsageSwitch
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          namespaceId={routeInfo.data.namespaceId}
        />
      </div>
      <CostTab
        selectedTimeOption={selectedTimeOption}
        setSelectedTimeOption={setSelectedTimeOption}
      />
    </div>
  );
};
