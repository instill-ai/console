import * as React from "react";
import { SelectOption } from "@instill-ai/design-system";

import {
  DashboardAvailableTimeframe,
  GeneralPageProp,
  Nullable,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  getTriggersSummary,
  usePipelineTriggerRecords,
} from "../../lib";
import { PageTitle } from "../../components";
import { PipelineTriggersSummary } from "./PipelineTriggersSummary";
import { FilterByDay } from "./FilterByDay";
import { PipelineTriggersTable } from "./PipelineTriggersTable";

export type DashboardPipelineDetailsPageMainViewProps = GeneralPageProp;

export const DashboardPipelineDetailsPageMainView = (
  props: DashboardPipelineDetailsPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;
  const { id } = router.query;

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

  React.useEffect(() => {
    let queryParams = ``;
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
      queryParams += `start='${start}' AND stop='${stop}' AND pipeline_id='${id?.toString()}'`;
      queryParamsPrevious += `start='${previousTime}' AND stop='${start}' AND pipeline_id='${id?.toString()}'`;
    }

    setQueryString(queryParams);
    setQueryStringPrevious(queryParamsPrevious);
  }, [id, selectedTimeOption]);

  /* -------------------------------------------------------------------------
   * Query pipeline data
   * -----------------------------------------------------------------------*/

  const pipelineTriggerRecords = usePipelineTriggerRecords({
    enabled: enableQuery,
    filter: queryString ? queryString : `pipeline_id='${id?.toString()}'`,
    accessToken,
  });

  const previousPipelineTriggerRecords = usePipelineTriggerRecords({
    enabled: enableQuery,
    filter: queryStringPrevious
      ? queryStringPrevious
      : `pipeline_id='${id?.toString()}'`,
    accessToken,
  });

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
