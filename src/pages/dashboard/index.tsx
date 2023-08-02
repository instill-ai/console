import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { Select, SingleSelectOption } from "@instill-ai/design-system";
import {
  DashboardAvailableTimeframe,
  FilterByDay,
  Nullable,
  PipelineTriggerCountsLineChart,
  PipelineTriggersSummary,
  PipelineWithWatchState,
  defaultSelectOption,
  defaultTimeOption,
  getPipelineTriggerCounts,
  getPipelineTriggersSummary,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  statusOptions,
  usePipelineTriggerRecords,
  usePipelines,
  useWatchPipelines,
  PipelineTriggerCount,
  DashboardPipelinesTable,
} from "@instill-ai/toolkit";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  /* -------------------------------------------------------------------------
   * Get the pipeline definition and static state for fields
   * -----------------------------------------------------------------------*/
  const [selectedTimeOption, setSelectedTimeOption] =
    useState<SingleSelectOption>(defaultTimeOption);
  const [selectedStatusOption, setSelectedStatusOption] =
    useState<Nullable<SingleSelectOption>>(defaultSelectOption);
  const [queryString, setQueryString] = useState<Nullable<string>>("");
  const [queryStringPrevious, setQueryStringPrevious] =
    useState<Nullable<string>>("");

  useEffect(() => {
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

  const pipelines = usePipelines({
    enabled: true,
    accessToken: null,
  });

  const pipelinesWatchState = useWatchPipelines({
    enabled: pipelines.isSuccess,
    pipelineNames: pipelines.isSuccess ? pipelines.data.map((p) => p.name) : [],
    accessToken: null,
  });

  const pipelineTriggerRecords = usePipelineTriggerRecords({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : null,
  });

  const previousPipelineTriggerRecords = usePipelineTriggerRecords({
    enabled: true,
    accessToken: null,
    filter: queryStringPrevious ? queryStringPrevious : null,
  });

  const pipelineTriggerCounts = useMemo<PipelineTriggerCount[]>(() => {
    if (
      !pipelineTriggerRecords.isSuccess ||
      !pipelines.isSuccess ||
      !pipelinesWatchState.isSuccess
    ) {
      return [];
    }

    const pipelinesWithWatchState: PipelineWithWatchState[] =
      pipelines.data.map((pipeline) => ({
        ...pipeline,
        watchState:
          pipelinesWatchState.data[pipeline.name].state ?? "STATE_DELETED",
      }));

    const pipelineTriggerCounts = getPipelineTriggerCounts(
      pipelineTriggerRecords.data,
      pipelinesWithWatchState,
      selectedTimeOption
    );

    if (selectedStatusOption && selectedStatusOption.value !== "all") {
      return pipelineTriggerCounts.filter(
        (pipelies) => pipelies.watchState === selectedStatusOption.value
      );
    }

    return pipelineTriggerCounts;
  }, [
    selectedStatusOption,
    selectedTimeOption,
    pipelineTriggerRecords.isSuccess,
    pipelineTriggerRecords.data,
    pipelines.isSuccess,
    pipelines.data,
    pipelinesWatchState.isSuccess,
    pipelinesWatchState.data,
  ]);

  const pipelineTriggersSummary = useMemo(() => {
    if (
      !pipelineTriggerRecords.isSuccess ||
      !previousPipelineTriggerRecords.isSuccess ||
      !pipelineTriggerCounts
    ) {
      return null;
    }

    const triggeredPipelineIdList = pipelineTriggerCounts.map(
      (e) => e.pipeline_id
    );

    return getPipelineTriggersSummary(
      pipelineTriggerRecords.data.filter((trigger) =>
        triggeredPipelineIdList.includes(trigger.pipeline_id)
      ),
      previousPipelineTriggerRecords.data.filter((trigger) =>
        triggeredPipelineIdList.includes(trigger.pipeline_id)
      )
    );
  }, [
    pipelineTriggerRecords.isSuccess,
    pipelineTriggerRecords.data,
    previousPipelineTriggerRecords.isSuccess,
    previousPipelineTriggerRecords.data,
    pipelineTriggerCounts,
  ]);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="dashboard" />
      <div className="flex flex-col">
        <h2 className="mb-10 w-full text-3xl font-semibold leading-[38px] text-semantic-fg-primary">
          Pipeline Triggers
        </h2>

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
                  pipelineTriggersSummary
                    ? pipelineTriggersSummary.errored
                    : null
                }
              />
            </PipelineTriggersSummary>
          </div>
          {/* Filter for graph */}
          <div className="w-1/2 self-end">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-row-reverse">
                <div className="w-1/3">
                  <Select.Root
                    defaultValue={statusOptions[0].value}
                    onValueChange={(statusOption) => {
                      setSelectedStatusOption({
                        label: statusOption,
                        value: statusOption,
                      });
                    }}
                  >
                    <Select.Trigger className="z-10 flex w-1/2 flex-row gap-x-2 !rounded-sm bg-white">
                      <Select.Value
                        placeholder="Status: All"
                        className="z-10 flex w-1/2 flex-row gap-x-2"
                      />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        {statusOptions.map((statusOption) => (
                          <Select.Item
                            value={statusOption.value}
                            key={statusOption.value}
                          >
                            {statusOption.label}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
              <div className="my-1">
                <FilterByDay
                  refetch={pipelineTriggerRecords.refetch}
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
            isLoading={pipelineTriggerRecords.isLoading}
            pipelines={pipelineTriggerCounts}
            selectedTimeOption={selectedTimeOption}
          />
        </div>

        {/* Pipeline Table */}

        <div className="my-4">
          <DashboardPipelinesTable
            pipelineTriggerCounts={pipelineTriggerCounts}
            isError={pipelineTriggerRecords.isError || pipelines.isError}
            isLoading={pipelineTriggerRecords.isLoading || pipelines.isLoading}
          />
        </div>
      </div>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content contentPadding="py-8 px-16">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
