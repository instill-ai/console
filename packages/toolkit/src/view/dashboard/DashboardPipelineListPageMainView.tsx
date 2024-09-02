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
import { DashboardPipelinesTable } from "./DashboardPipelinesTable";
import { FilterByDay } from "./FilterByDay";
import { PipelineTriggerCountsLineChart } from "./PipelineTriggerCountsLineChart";
import { ModelsTriggerCountsLineChart } from "./ModelsTriggerCountsLineChart";
import { TotalCreditCostChart } from "./TotalCreditCostChart";
import { TotalCreditTrendChart } from "./TotalCreditTrendChart";

export type DashboardPipelineListPageMainViewProps = GeneralAppPageProp;

export const DashboardPipelineListPageMainView = (
  props: DashboardPipelineListPageMainViewProps,
) => {
  const { accessToken, enableQuery, router } = props;

  /* -------------------------------------------------------------------------
   * Get the pipeline definition and static state for fields
   * -----------------------------------------------------------------------*/
  const [selectedTimeOption, setSelectedTimeOption] =
    React.useState<SelectOption>({
      label: "Today",
      value: "24h",
    });

  const [queryString, setQueryString] = React.useState<Nullable<string>>(null);
  const [queryStringPrevious, setQueryStringPrevious] =
    React.useState<Nullable<string>>(null);

  const routeInfo = useRouteInfo();

  React.useEffect(() => {
    if (!routeInfo.isSuccess) {
      return;
    }

    let queryParams = `ownerName='${routeInfo.data.namespaceName}'`;
    let queryParamsPrevious = `ownerName='${routeInfo.data.namespaceName}'`;

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(
        selectedTimeOption.value === "24h"
          ? "todayStart"
          : selectedTimeOption.value,
      );
      const stop = getTimeInRFC3339Format(
        selectedTimeOption?.value === "1d" ? "todayStart" : "now",
      );
      const previousTime = getTimeInRFC3339Format(
        getPreviousTimeframe(
          selectedTimeOption.value as DashboardAvailableTimeframe,
        ),
      );

      queryParams += ` AND start='${start}' AND stop='${stop}'`;
      queryParamsPrevious += ` AND start='${previousTime}' AND stop='${start}'`;
    }

    setQueryString(queryParams);
    setQueryStringPrevious(queryParamsPrevious);
  }, [selectedTimeOption, routeInfo.isSuccess, routeInfo.data.namespaceName]);

  /* -------------------------------------------------------------------------
   * Query pipeline and triggers data
   * -----------------------------------------------------------------------*/

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

  // Guard this page

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

    const chartList = pipelinesChart.data.map((pipeline) => ({
      ...pipeline,
    }));

    return chartList;
  }, [pipelinesChart.data, pipelinesChart.isSuccess]);

  const triggeredPipelineList = React.useMemo<TriggeredPipeline[]>(() => {
    if (!triggeredPipelines.isSuccess) {
      return [];
    }

    const tableList = triggeredPipelines.data.map((pipeline) => ({
      ...pipeline,
    }));

    return tableList;
  }, [triggeredPipelines]);

  const pipelineTriggersSummary = React.useMemo(() => {
    if (!previoustriggeredPipelines.isSuccess) {
      return null;
    }

    const triggeredPipelineIdList = triggeredPipelineList.map(
      (e) => e.pipelineId,
    );

    return getPipelineTriggersSummary(
      triggeredPipelineList,
      previoustriggeredPipelines.data.filter((trigger) =>
        triggeredPipelineIdList.includes(trigger.pipelineId),
      ),
    );
  }, [
    previoustriggeredPipelines.isSuccess,
    previoustriggeredPipelines.data,
    triggeredPipelineList,
  ]);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <div className="flex items-stretch space-x-4">

        {/* Filter for graph */}

        <div className="w-1/2 self-end">
          <div className="flex flex-col space-y-8">
            <div className="my-1">
              <FilterByDay
                refetch={() => {
                  pipelinesChart.refetch();
                  triggeredPipelines.refetch();
                }}
                selectedTimeOption={selectedTimeOption}
                setSelectedTimeOption={setSelectedTimeOption}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-5 w-full">
        {/* Pipeline Chart */}

        <div className="mb-8 w-full">
          <PipelineTriggerCountsLineChart
            isLoading={pipelinesChart.isLoading}
            pipelines={pipelinesChart.isSuccess ? pipelinesChartList : []}
            selectedTimeOption={selectedTimeOption}
            pipelineTriggersSummary={pipelineTriggersSummary}
          />
        </div>

        {/* Model Chart */}

        <div className="mb-8 w-full">
          <ModelsTriggerCountsLineChart
            isLoading={pipelinesChart.isLoading}
            pipelines={pipelinesChart.isSuccess ? pipelinesChartList : []}
            selectedTimeOption={selectedTimeOption}
            pipelineTriggersSummary={pipelineTriggersSummary}
          />
        </div>
      </div>

      <div className="flex gap-5 w-full">
        {/* Total Credit Cost Chart */}
        <div className="mb-8 w-full">
          <TotalCreditCostChart
            isLoading={pipelinesChart.isLoading}
            pipelines={pipelinesChart.isSuccess ? pipelinesChartList : []}
            selectedTimeOption={selectedTimeOption}
            pipelineTriggersSummary={pipelineTriggersSummary}
          />
        </div>

        {/* Total Credit Trend Chart */}
        <div className="mb-8 w-full">
          <TotalCreditTrendChart
            isLoading={pipelinesChart.isLoading}
            pipelines={pipelinesChart.isSuccess ? pipelinesChartList : []}
            selectedTimeOption={selectedTimeOption}
            pipelineTriggersSummary={pipelineTriggersSummary}
          />
        </div>
      </div>

      {/* Pipeline Table */}

      <div className="my-4">
        <DashboardPipelinesTable
          pipelineTriggerCounts={
            triggeredPipelines.data ? triggeredPipelineList : []
          }
          isError={triggeredPipelines.isError}
          isLoading={triggeredPipelines.isLoading}
        />
      </div>
    </div>
  )
}