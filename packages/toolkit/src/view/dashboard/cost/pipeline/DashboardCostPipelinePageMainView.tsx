"use client";

import * as React from "react";
import { SelectOption } from "@instill-ai/design-system";
import {
  GeneralAppPageProp,
  getTimeInRFC3339Format,
  Nullable,
  useModelTriggerComputationTimeCharts,
  usePipelineTriggerComputationTimeCharts,
  useRouteInfo,
} from "../../../../lib";
import { UsageSwitch } from "../../UsageSwitch";
import { CostTab } from "../../CostTab";

export type DashboardCostPipelinePageMainViewProps = GeneralAppPageProp;

export const DashboardCostPipelinePageMainView = ({
  accessToken,
  enableQuery,
  // router,
}: DashboardCostPipelinePageMainViewProps) => {
  const [selectedTimeOption, setSelectedTimeOption] = React.useState<SelectOption>({
    label: "Today",
    value: "24h",
  });

  const [queryString, setQueryString] = React.useState<Nullable<string>>(null);
  const [activeTab, setActiveTab] = React.useState<"activity" | "cost">("cost");

  const routeInfo = useRouteInfo();

  React.useEffect(() => {
    if (!routeInfo.isSuccess) {
      return;
    }

    let queryParams = `ownerName='${routeInfo.data.namespaceName}'`;

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(
        selectedTimeOption.value === "24h" ? "todayStart" : selectedTimeOption.value
      );
      const stop = getTimeInRFC3339Format(
        selectedTimeOption?.value === "1d" ? "todayStart" : "now"
      );

      queryParams += ` AND start='${start}' AND stop='${stop}'`;
    }

    setQueryString(queryParams);
  }, [selectedTimeOption, routeInfo.isSuccess, routeInfo.data?.namespaceName]);


  const pipelinesChart = usePipelineTriggerComputationTimeCharts({
    enabled: enableQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
  });

  const modelsChart = useModelTriggerComputationTimeCharts({
    enabled: enableQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
  });


  // React.useEffect(() => {
  //   if (
  //     triggeredPipelines.isError ||
  //     pipelinesChart.isError ||
  //     previousTriggeredPipelines.isError ||
  //     triggeredModels.isError ||
  //     modelsChart.isError ||
  //     previousTriggeredModels.isError
  //   ) {
  //     router.push("/404");
  //   }
  // }, [
  //   router,
  //   triggeredPipelines.isError,
  //   pipelinesChart.isError,
  //   previousTriggeredPipelines.isError,
  //   triggeredModels.isError,
  //   modelsChart.isError,
  //   previousTriggeredModels.isError,
  // ]);




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
        pipelinesChart={pipelinesChart}
        modelsChart={modelsChart}
        accessToken={accessToken}
        enabledQuery={enableQuery}
      />
    </div>
  );
};