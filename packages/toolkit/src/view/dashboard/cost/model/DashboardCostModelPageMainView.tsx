"use client";

import * as React from "react";

import { SelectOption } from "@instill-ai/design-system";

import { GeneralAppPageProp, useRouteInfo } from "../../../../lib";
import { UsageSwitch } from "../../UsageSwitch";
import { CostTab } from "../CostTab";

export type DashboardCostModelPageMainViewProps = GeneralAppPageProp;

export const DashboardCostModelPageMainView = ({
  accessToken,
  enableQuery,
}: DashboardCostModelPageMainViewProps) => {
  const [selectedTimeOption, setSelectedTimeOption] =
    React.useState<SelectOption>({
      label: "Today",
      value: "24h",
    });

  const [activeTab, setActiveTab] = React.useState<"activity" | "cost">("cost");

  const routeInfo = useRouteInfo();

  return (
    <div className="flex flex-col">
      <h1 className="product-headings-heading-4 mb-2">Usage</h1>
      <UsageSwitch
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        namespaceId={routeInfo.data.namespaceId}
      />
      <CostTab
        selectedTimeOption={selectedTimeOption}
        setSelectedTimeOption={setSelectedTimeOption}
        accessToken={accessToken}
        enabledQuery={enableQuery}
      />
    </div>
  );
};
