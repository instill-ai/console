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

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-y-2 mb-5">
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
