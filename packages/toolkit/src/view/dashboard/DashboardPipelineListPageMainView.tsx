"use client";

import * as React from "react";
import { SelectOption } from "@instill-ai/design-system";
import {
  DashboardAvailableTimeframe,
  GeneralAppPageProp,
  getPipelineTriggersSummary,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  Nullable,
  PipelinesChart,
  TriggeredPipeline,
  usePipelineTriggerComputationTimeCharts,
  usePipelineTriggerMetric,
  useRouteInfo,
} from "../../lib";
import { UsageSwitch } from "./UsageSwitch";
import { ActivityTab } from "./ActivityTab";
import { CostTab } from "./CostTab";

export type DashboardPipelineListPageMainViewProps = GeneralAppPageProp;

export const DashboardPipelineListPageMainView = ({
  accessToken,
  enableQuery,
  router,
}: DashboardPipelineListPageMainViewProps) => {
  const [selectedTimeOption, setSelectedTimeOption] = React.useState<SelectOption>({
    label: "Today",
    value: "24h",
  });

  const [queryString, setQueryString] = React.useState<Nullable<string>>(null);
  const [queryStringPrevious, setQueryStringPrevious] = React.useState<Nullable<string>>(null);
  const [activeTab, setActiveTab] = React.useState<"activity" | "cost">("activity");

  const routeInfo = useRouteInfo();

  React.useEffect(() => {
    if (!routeInfo.isSuccess) {
      return;
    }

    let queryParams = `ownerName='${routeInfo.data.namespaceName}'`;
    let queryParamsPrevious = `ownerName='${routeInfo.data.namespaceName}'`;

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(
        selectedTimeOption.value === "24h" ? "todayStart" : selectedTimeOption.value
      );
      const stop = getTimeInRFC3339Format(
        selectedTimeOption?.value === "1d" ? "todayStart" : "now"
      );
      const previousTime = getTimeInRFC3339Format(
        getPreviousTimeframe(selectedTimeOption.value as DashboardAvailableTimeframe)
      );

      queryParams += ` AND start='${start}' AND stop='${stop}'`;
      queryParamsPrevious += ` AND start='${previousTime}' AND stop='${start}'`;
    }

    setQueryString(queryParams);
    setQueryStringPrevious(queryParamsPrevious);
  }, [selectedTimeOption, routeInfo.isSuccess, routeInfo.data?.namespaceName]);

  const triggeredPipelines = usePipelineTriggerMetric({
    enabled: enableQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
  });

  const pipelinesChart = usePipelineTriggerComputationTimeCharts({
    enabled: enableQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
  });

  const previoustriggeredPipelines = usePipelineTriggerMetric({
    enabled: enableQuery && !!queryStringPrevious,
    filter: queryStringPrevious ? queryStringPrevious : null,
    accessToken,
  });

  React.useEffect(() => {
    if (
      triggeredPipelines.isError ||
      pipelinesChart.isError ||
      previoustriggeredPipelines.isError
    ) {
      router.push("/404");
    }
  }, [
    router,
    triggeredPipelines.isError,
    pipelinesChart.isError,
    previoustriggeredPipelines.isError,
  ]);

  const pipelinesChartList = React.useMemo<PipelinesChart[]>(() => {
    if (!pipelinesChart.isSuccess) {
      return [];
    }

    return pipelinesChart.data.map((pipeline) => ({
      ...pipeline,
    }));
  }, [pipelinesChart.data, pipelinesChart.isSuccess]);

  const triggeredPipelineList = React.useMemo<TriggeredPipeline[]>(() => {
    if (!triggeredPipelines.isSuccess) {
      return [];
    }

    return triggeredPipelines.data.map((pipeline) => ({
      ...pipeline,
    }));
  }, [triggeredPipelines]);

  const pipelineTriggersSummary = React.useMemo(() => {
    if (!previoustriggeredPipelines.isSuccess) {
      return null;
    }

    const triggeredPipelineIdList = triggeredPipelineList.map(
      (e) => e.pipelineId
    );

    return getPipelineTriggersSummary(
      triggeredPipelineList,
      previoustriggeredPipelines.data.filter((trigger) =>
        triggeredPipelineIdList.includes(trigger.pipelineId)
      )
    );
  }, [
    previoustriggeredPipelines.isSuccess,
    previoustriggeredPipelines.data,
    triggeredPipelineList,
  ]);

  return (
    <div className="flex flex-col">
      <h1 className="product-headings-heading-4 mb-2">Usage</h1>
      <UsageSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "activity" ? (
        <ActivityTab
          pipelinesChart={pipelinesChart}
          pipelinesChartList={pipelinesChartList}
          selectedTimeOption={selectedTimeOption}
          setSelectedTimeOption={setSelectedTimeOption}
          pipelineTriggersSummary={pipelineTriggersSummary}
        />
      ) : (
        <CostTab
          pipelinesChart={pipelinesChart}
          pipelinesChartList={pipelinesChartList}
          selectedTimeOption={selectedTimeOption}
          setSelectedTimeOption={setSelectedTimeOption}
          pipelineTriggersSummary={pipelineTriggersSummary}
        />
      )}
    </div>
  );
};