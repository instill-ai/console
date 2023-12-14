import * as React from "react";
import { SelectOption, Button, Icons } from "@instill-ai/design-system";
// import SemiCircleProgressBar from "react-progressbar-semicircle";
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
  useUser,
  useNamespaceType,
  useUsersSubscription,
  useOrganizationsSubscription,
  useUserMe,
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

  React.useEffect(() => {
    let queryParams = "";
    let queryParamsPrevious = "";

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

      if (queryParams) {
        queryParams += ` AND start='${start}' AND stop='${stop}'`;
        queryParamsPrevious += ` AND start='${stop}' AND stop='${start}'`;
      } else {
        queryParams += `start='${start}' AND stop='${stop}'`;
        queryParamsPrevious += `start='${previousTime}' AND stop='${start}'`;
      }
    }

    setQueryString(queryParams);
    setQueryStringPrevious(queryParamsPrevious);
  }, [selectedTimeOption]);

  /* -------------------------------------------------------------------------
   * Query pipeline and triggers data
   * -----------------------------------------------------------------------*/

  const triggeredPipelines = useTriggeredPipelines({
    enabled: enableQuery,
    filter: queryString ? queryString : null,
    accessToken,
  });

  const pipelinesChart = useTriggeredPipelinesChart({
    enabled: enableQuery,
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

  // Remaing Triggers
  const instillUser = useUserMe({
    enabled: enableQuery,
    retry: false,
    accessToken,
  });
  const namespaceType = useNamespaceType({
    namespace: String(instillUser.data?.id) ?? null,
    enabled: enableQuery,
    accessToken,
  });
  const userSubscription = useUsersSubscription({
    userName: instillUser.isSuccess ? instillUser.data.id : null,
    enabled:
      namespaceType.isSuccess && namespaceType.data === "NAMESPACE_USER"
        ? enableQuery
        : false,
    accessToken,
  });
  const organizationSubscription = useOrganizationsSubscription({
    oraganizationName: instillUser.isSuccess ? instillUser.data.id : null,
    enabled:
      namespaceType.isSuccess && namespaceType.data === "NAMESPACE_ORGANIZATION"
        ? true
        : false,
    accessToken,
  });
  const subscriptions = React.useMemo(() => {
    if (namespaceType.data === "NAMESPACE_USER") {
      if (userSubscription.isLoading) {
        userSubscription.refetch();
      }
      if (userSubscription.data) {
        return userSubscription;
      }
    }
    if (namespaceType.data === "NAMESPACE_ORGANIZATION") {
      if (organizationSubscription.isLoading) {
        organizationSubscription.refetch();
      }
      if (organizationSubscription.data) {
        return organizationSubscription;
      }
    }
  }, [namespaceType, userSubscription, organizationSubscription]);

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
                subscriptions={
                  subscriptions?.isSuccess ? subscriptions?.data : null
                }
                user={instillUser.isSuccess ? instillUser.data : null}
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
