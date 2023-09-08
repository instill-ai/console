import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { Logo, Select, SingleSelectOption } from "@instill-ai/design-system";
import {
  DashboardAvailableTimeframe,
  Nullable,
  PipelineTriggersSummary,
  defaultSelectOption,
  defaultTimeOption,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  statusOptions,
  usePipelines,
  getPipelineTriggersSummary,
  FilterByDay,
  PipelineTriggerCountsLineChart,
  DashboardPipelinesTable,
  useTriggeredPipelines,
  useTriggeredPipelinesChart,
  TriggeredPipeline,
  PipelinesChart,
  useWatchUserPipelineReleases,
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

  // Under current design, the state is with pipeline release, so we need to
  // query all the pipeline releases and filter from the data.

  const pipelinesWatchState = useWatchUserPipelineReleases({
    enabled: pipelines.isSuccess,
    pipelineReleaseNames: pipelines.isSuccess
      ? pipelines.data.map((p) => p.name)
      : [],
    accessToken: null,
  });

  const triggeredPipelines = useTriggeredPipelines({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : null,
  });

  const pipelinesChart = useTriggeredPipelinesChart({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : null,
  });

  const previoustriggeredPipelines = useTriggeredPipelines({
    enabled: true,
    accessToken: null,
    filter: queryStringPrevious ? queryStringPrevious : null,
  });

  const pipelinesChartList = useMemo<PipelinesChart[]>(() => {
    if (!pipelinesChart.isSuccess || !pipelinesWatchState.isSuccess) {
      return [];
    }

    const chartList = pipelinesChart.data.map((pipeline) => ({
      ...pipeline,
      watchState:
        pipelinesWatchState.data[`pipelines/${pipeline.pipeline_id}`]?.state ??
        "STATE_DELETED",
    }));

    if (selectedStatusOption && selectedStatusOption.value !== "all") {
      return chartList.filter(
        (pipelies) => pipelies.watchState === selectedStatusOption.value
      );
    }
    return chartList;
  }, [
    pipelinesWatchState,
    pipelinesChart.isSuccess,
    pipelinesChart.data,
    selectedStatusOption,
  ]);

  const triggeredPipelineList = useMemo<TriggeredPipeline[]>(() => {
    if (!triggeredPipelines.isSuccess || !pipelinesWatchState.isSuccess) {
      return [];
    }

    const tableList = triggeredPipelines.data.map((pipeline) => ({
      ...pipeline,
      watchState:
        pipelinesWatchState.data[`pipelines/${pipeline.pipeline_id}`]?.state ??
        "STATE_DELETED",
    }));

    if (selectedStatusOption && selectedStatusOption.value !== "all") {
      return tableList.filter(
        (pipelies) => pipelies.watchState === selectedStatusOption.value
      );
    }
    return tableList;
  }, [triggeredPipelines, pipelinesWatchState, selectedStatusOption]);

  const pipelineTriggersSummary = useMemo(() => {
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
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="ColourLogomarkWhiteType" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content contentPadding="py-8 px-16">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
