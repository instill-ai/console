"use client";

import * as React from "react";

import { SelectOption } from "@instill-ai/design-system";

import { PageTitle } from "../../components";
import {
  DashboardAvailableTimeframe,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  getTriggersSummary,
  InstillStore,
  Nullable,
  useInstillStore,
  usePipelineTriggers,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { PipelineTriggersSummary } from "./activity/PipelineTriggersSummary";
import { FilterByDay } from "./FilterByDay";
import { PipelineTriggersTable } from "./PipelineTriggersTable";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const DashboardPipelineDetailsPageMainView = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const [selectedTimeOption, setSelectedTimeOption] =
    React.useState<SelectOption>({
      label: "24h",
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

    let queryParams = `pipelineId='${routeInfo.data.resourceId}' AND ownerName='${routeInfo.data.namespaceName}'`;
    let queryParamsPrevious = `pipelineId='${routeInfo.data.resourceId}' AND ownerName='${routeInfo.data.namespaceName}'`;

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
  }, [selectedTimeOption, routeInfo.isSuccess, routeInfo.data]);

  /* -------------------------------------------------------------------------
   * Query pipeline data
   * -----------------------------------------------------------------------*/

  const triggers = usePipelineTriggers({
    enabled:
      enabledQuery &&
      routeInfo.isSuccess &&
      !!queryString &&
      !!queryStringPrevious,
    filter: queryString ? queryString : null,
    accessToken,
    filterId: routeInfo.isSuccess
      ? `${routeInfo.data.namespaceId}-${selectedTimeOption.value}`
      : null,
  });

  const previousTriggers = usePipelineTriggers({
    enabled:
      enabledQuery &&
      routeInfo.isSuccess &&
      !!queryString &&
      !!queryStringPrevious,
    filter: queryStringPrevious ? queryStringPrevious : null,
    accessToken,
    filterId: routeInfo.isSuccess
      ? `${routeInfo.data.namespaceId}-${selectedTimeOption.value}-previous`
      : null,
  });

  const pipelineTriggersSummary = React.useMemo(() => {
    if (!triggers.isSuccess || !previousTriggers.isSuccess) {
      return null;
    }

    return getTriggersSummary(triggers.data, previousTriggers.data);
  }, [
    triggers.isSuccess,
    triggers.data,
    previousTriggers.isSuccess,
    previousTriggers.data,
  ]);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <PageTitle
        title=""
        breadcrumbs={["Dashboard", "Pipeline Details"]}
        className="mb-1"
      />

      {/* Status */}

      <div className="flex items-stretch space-x-4">
        <div className="w-1/2">
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
          <div className="my-1">
            <FilterByDay
              refetch={triggers.refetch}
              selectedTimeOption={selectedTimeOption}
              setSelectedTimeOption={setSelectedTimeOption}
            />
          </div>
        </div>
      </div>

      {/* Pipeline Table */}

      <div className="mt-8">
        <PipelineTriggersTable
          pipelineTriggers={triggers.isSuccess ? triggers.data : []}
          isError={triggers.isError}
          isLoading={triggers.isLoading}
        />
      </div>
    </div>
  );
};
