import * as React from "react";
import { SelectOption } from "@instill-ai/design-system";
import { PipelineTriggersSummary } from "./PipelineTriggersSummary";
import {
  DashboardAvailableTimeframe,
  GeneralPageProp,
  Nullable,
  PipelinesChart,
  TriggeredPipeline,
  getPipelineTriggersSummary,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  useTriggeredPipelines,
  useTriggeredPipelinesChart,
  dashboardOptions,
  useUsersSubscription,
  useOrganizationsSubscription,
  useUserMe,
  useEntity,
} from "../../lib";
import { FilterByDay } from "./FilterByDay";
import { PipelineTriggerCountsLineChart } from "./PipelineTriggerCountsLineChart";
import { DashboardPipelinesTable } from "./DashboardPipelinesTable";
import RemainingTriggers from "./RemainingTriggers";

export type DashboardPipelineListPageMainViewProps = Omit<
  GeneralPageProp,
  "router"
> & { isCloud: boolean };

export const DashboardPipelineListPageMainView = (
  props: DashboardPipelineListPageMainViewProps
) => {
  const { accessToken, enableQuery, isCloud } = props;

  /* -------------------------------------------------------------------------
   * Get the pipeline definition and static state for fields
   * -----------------------------------------------------------------------*/
  const [selectedTimeOption, setSelectedTimeOption] =
    React.useState<SelectOption>(dashboardOptions.timeLine[0]);

  const [queryString, setQueryString] = React.useState<Nullable<string>>(null);
  const [queryStringPrevious, setQueryStringPrevious] =
    React.useState<Nullable<string>>(null);

  const entityObject = useEntity();

  React.useEffect(() => {
    if (!entityObject.isSuccess) {
      return;
    }
    let queryParams = `owner_name='${entityObject.entityName}'`;
    let queryParamsPrevious = `owner_name='${entityObject.entityName}'`;

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(
        selectedTimeOption.value === "24h"
          ? "todayStart"
          : selectedTimeOption.value
      );
      const stop = getTimeInRFC3339Format(
        selectedTimeOption?.value === "1d" ? "todayStart" : "now"
      );
      const previousTime = getTimeInRFC3339Format(
        getPreviousTimeframe(
          selectedTimeOption.value as DashboardAvailableTimeframe
        )
      );

      queryParams += ` AND start='${start}' AND stop='${stop}'`;
      queryParamsPrevious += ` AND start='${previousTime}' AND stop='${start}'`;
    }

    setQueryString(queryParams);
    setQueryStringPrevious(queryParamsPrevious);
  }, [selectedTimeOption, entityObject.isSuccess]);

  /* -------------------------------------------------------------------------
   * Query pipeline and triggers data
   * -----------------------------------------------------------------------*/

  const triggeredPipelines = useTriggeredPipelines({
    enabled: enableQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
  });

  const pipelinesChart = useTriggeredPipelinesChart({
    enabled: enableQuery && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
  });

  const previoustriggeredPipelines = useTriggeredPipelines({
    enabled: enableQuery,
    filter: queryStringPrevious ? queryStringPrevious : null,
    accessToken,
  });

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
      (e) => e.pipeline_id
    );

    return getPipelineTriggersSummary(
      triggeredPipelineList,
      previoustriggeredPipelines.data.filter((trigger) =>
        triggeredPipelineIdList.includes(trigger.pipeline_id)
      )
    );
  }, [
    previoustriggeredPipelines.isSuccess,
    previoustriggeredPipelines.data,
    triggeredPipelineList,
  ]);

  // Query the Remaing Triggers
  const me = useUserMe({
    enabled: enableQuery,
    retry: false,
    accessToken,
  });

  const userSubscription = useUsersSubscription({
    userName: entityObject.isSuccess ? entityObject.entityName : null,
    enabled:
      entityObject.isSuccess && entityObject.namespaceType === "NAMESPACE_USER",
    accessToken,
  });

  const organizationSubscription = useOrganizationsSubscription({
    oraganizationName: entityObject.isSuccess ? entityObject.entityName : null,
    enabled:
      entityObject.isSuccess &&
      entityObject.namespaceType === "NAMESPACE_ORGANIZATION",
    accessToken,
  });

  // Determine the subscription array by the type of current entity

  const subscriptions = React.useMemo(() => {
    if (!entityObject.isSuccess) {
      return null;
    }

    if (
      entityObject.namespaceType === "NAMESPACE_USER" &&
      userSubscription.isSuccess
    ) {
      return userSubscription.data;
    }

    if (
      entityObject.namespaceType === "NAMESPACE_ORGANIZATION" &&
      organizationSubscription.isSuccess
    ) {
      return organizationSubscription.data;
    }

    return null;
  }, [
    entityObject.isSuccess,
    entityObject.namespaceType,
    userSubscription.isSuccess,
    userSubscription.data,
    organizationSubscription.isSuccess,
    organizationSubscription.data,
  ]);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <h2 className="mb-10 w-full text-3xl font-semibold leading-[38px] text-semantic-fg-primary">
        Pipeline Triggers
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

            {isCloud ? (
              <RemainingTriggers
                subscriptions={subscriptions}
                user={me.isSuccess ? me.data : null}
              />
            ) : null}
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
