"use client";

import type {
  PipelineTriggerChartRecord,
  PipelineTriggerTableRecord,
} from "instill-sdk";
import * as React from "react";

import { SelectOption } from "@instill-ai/design-system";

import {
  DashboardAvailableTimeframe,
  GeneralAppPageProp,
  getPipelineTriggersSummary,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  Nullable,
  usePipelineTriggerComputationTimeCharts,
  usePipelineTriggerMetric,
  useRouteInfo,
} from "../../lib";
import { PipelineTriggerCountsLineChart } from "./activity/PipelineTriggerCountsLineChart";
import { PipelineTriggersSummary } from "./activity/PipelineTriggersSummary";
import { DashboardPipelinesTable } from "./DashboardPipelinesTable";
import { FilterByDay } from "./FilterByDay";

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
    requesterId: routeInfo.data.namespaceId ?? undefined,
  });

  const pipelinesChart = usePipelineTriggerComputationTimeCharts({
    enabled: enableQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
    requesterId: routeInfo.data.namespaceId ?? undefined,
  });

  const previoustriggeredPipelines = usePipelineTriggerMetric({
    enabled: enableQuery && !!queryStringPrevious,
    filter: queryStringPrevious ? queryStringPrevious : null,
    accessToken,
    requesterId: routeInfo.data.namespaceId ?? undefined,
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

  const pipelinesChartList = React.useMemo<PipelineTriggerChartRecord[]>(() => {
    if (!pipelinesChart.isSuccess) {
      return [];
    }

    const chartList = pipelinesChart.data.map((pipeline) => ({
      ...pipeline,
    }));

    return chartList;
  }, [pipelinesChart.data, pipelinesChart.isSuccess]);

  const triggeredPipelineList = React.useMemo<
    PipelineTriggerTableRecord[]
  >(() => {
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
      <h2 className="mb-10 w-full text-3xl font-semibold leading-[38px] text-semantic-fg-primary">
        Pipeline Runs
      </h2>

      {/* Status */}

      <div className="flex items-stretch space-x-4">
        <div className="w-2/3">
          <PipelineTriggersSummary>
            <PipelineTriggersSummary.Card
              summary={
                pipelineTriggersSummary
                  ? pipelineTriggersSummary.completed
                  : null
              }
            />
            <PipelineTriggersSummary.Card
              summary={
                pipelineTriggersSummary ? pipelineTriggersSummary.errored : null
              }
            />
          </PipelineTriggersSummary>
        </div>

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

      {/* Pipeline Chart */}

      <div className="my-8">
        <PipelineTriggerCountsLineChart
          isLoading={pipelinesChart.isLoading}
          pipelines={pipelinesChart.isSuccess ? pipelinesChartList : []}
          selectedTimeOption={selectedTimeOption}
          pipelineTriggersSummary={null}
        />
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
  );
};
