"use client";

import * as React from "react";
import { SelectOption } from "@instill-ai/design-system";

import {
  DashboardAvailableTimeframe,
  GeneralPageProp,
  Nullable,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  getTriggersSummary,
  useEntity,
  usePipelineTriggerRecords,
} from "../../lib";
import { PageTitle } from "../../components";
import { PipelineTriggersSummary } from "./PipelineTriggersSummary";
import { FilterByDay } from "./FilterByDay";
import { PipelineTriggersTable } from "./PipelineTriggersTable";
import { useParams } from "next/navigation";

export type DashboardPipelineDetailsPageMainViewProps = GeneralPageProp;

export const DashboardPipelineDetailsPageMainView = (
  props: DashboardPipelineDetailsPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;
  const { id } = useParams();

  /* -------------------------------------------------------------------------
   * Get the pipeline definition and static state for fields
   * -----------------------------------------------------------------------*/

  const [selectedTimeOption, setSelectedTimeOption] =
    React.useState<SelectOption>({
      label: "24h",
      value: "24h",
    });

  const [queryString, setQueryString] = React.useState<Nullable<string>>(null);
  const [queryStringPrevious, setQueryStringPrevious] =
    React.useState<Nullable<string>>(null);

  const entityObject = useEntity();

  React.useEffect(() => {
    if (!entityObject.isSuccess) {
      return;
    }

    let queryParams = `pipeline_id='${entityObject.id}' AND owner_name='${entityObject.entityName}'`;
    let queryParamsPrevious = `pipeline_id='${entityObject.id}' AND owner_name='${entityObject.entityName}'`;

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
  }, [
    id,
    selectedTimeOption,
    entityObject.isSuccess,
    entityObject.entityName,
    entityObject.id,
  ]);

  /* -------------------------------------------------------------------------
   * Query pipeline data
   * -----------------------------------------------------------------------*/

  const pipelineTriggerRecords = usePipelineTriggerRecords({
    enabled: enableQuery && entityObject.isSuccess && !!queryString,
    filter: queryString ? queryString : null,
    accessToken,
  });

  const previousPipelineTriggerRecords = usePipelineTriggerRecords({
    enabled: enableQuery && entityObject.isSuccess && !!queryStringPrevious,
    filter: queryStringPrevious ? queryStringPrevious : null,
    accessToken,
  });

  // Guard this page
  React.useEffect(() => {
    if (
      pipelineTriggerRecords.isError ||
      previousPipelineTriggerRecords.isError
    ) {
      router.push("/404");
    }
  }, [
    router,
    pipelineTriggerRecords.isError,
    previousPipelineTriggerRecords.isError,
  ]);

  const pipelineTriggersSummary = React.useMemo(() => {
    if (
      !pipelineTriggerRecords.isSuccess ||
      !previousPipelineTriggerRecords.isSuccess
    ) {
      return null;
    }

    return getTriggersSummary(
      pipelineTriggerRecords.data,
      previousPipelineTriggerRecords.data
    );
  }, [
    pipelineTriggerRecords.isSuccess,
    pipelineTriggerRecords.data,
    previousPipelineTriggerRecords.isSuccess,
    previousPipelineTriggerRecords.data,
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
              refetch={pipelineTriggerRecords.refetch}
              selectedTimeOption={selectedTimeOption}
              setSelectedTimeOption={setSelectedTimeOption}
            />
          </div>
        </div>
      </div>

      {/* Pipeline Table */}

      <div className="mt-8">
        <PipelineTriggersTable
          pipelineTriggers={
            pipelineTriggerRecords.isSuccess ? pipelineTriggerRecords.data : []
          }
          isError={pipelineTriggerRecords.isError}
          isLoading={pipelineTriggerRecords.isLoading}
        />
      </div>
    </div>
  );
};
