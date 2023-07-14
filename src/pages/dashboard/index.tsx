import React, { FC, ReactElement } from "react";
import { PageTitle, PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { StatusCardsGroup } from "@/components/cards";
import { PipelineTriggerCount, Status, StatusCount } from "@/types";
import {
  defaultSelectOption,
  defaultStatusCount,
  defaultTimeOption,
  getPipelinesTriggerCount,
  getPreviousTime,
  getStatusCount,
  getTimeInRFC3339Format,
  statusOptions,
  usePipelineTriggersMetric,
} from "@/lib/dashboard";
import { DashboardPipelinesTable } from "@/components/DashboardPipelinesTable";
import { LineChart } from "@/components/charts";
import { Select, SingleSelectOption } from "@instill-ai/design-system";
import { Nullable, usePipelines } from "@instill-ai/toolkit";
import { FilterByDay } from "@/components/filter/FilterByDay";

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
    React.useState<SingleSelectOption>(defaultTimeOption);
  const [selectedStatusOption, setSelectedStatusOption] =
    React.useState<Nullable<SingleSelectOption>>(defaultSelectOption);
  const [queryString, setQueryString] = React.useState<Nullable<string>>("");
  const [queryStringPrevious, setQueryStringPrevious] =
    React.useState<Nullable<string>>("");

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
        getPreviousTime(selectedTimeOption.value)
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

  const triggers = usePipelineTriggersMetric({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : null,
  });

  const triggersPrevious = usePipelineTriggersMetric({
    enabled: true,
    accessToken: null,
    filter: queryStringPrevious ? queryStringPrevious : null,
  });

  const pipeliesResult = React.useMemo<PipelineTriggerCount[]>(() => {
    if (triggers.data && pipelines.data) {
      const formattedPipelines = getPipelinesTriggerCount(
        triggers.data,
        pipelines.data,
        selectedTimeOption
      );
      if (selectedStatusOption && selectedStatusOption.value !== "all") {
        return formattedPipelines.filter(
          (pipelies) => pipelies.status === selectedStatusOption.value
        );
      }
      return formattedPipelines;
    }
    return [];
  }, [selectedStatusOption, selectedTimeOption, triggers.data, pipelines.data]);

  const statusCount = React.useMemo<StatusCount>(() => {
    if ((triggers.data && triggersPrevious.data, pipeliesResult.length)) {
      const pipeliesList = pipeliesResult.map(
        (pipelies) => pipelies.pipeline_id
      );
      const triggersData = triggers.data?.filter((trigger) =>
        pipeliesList.includes(trigger.pipeline_id)
      );
      const triggersPreviousData = triggersPrevious.data?.filter((trigger) =>
        pipeliesList.includes(trigger.pipeline_id)
      );
      return getStatusCount(triggersData || [], triggersPreviousData || []);
    }
    return defaultStatusCount;
  }, [pipeliesResult, triggers.data, triggersPrevious.data]);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="dashboard" />
      <div className="flex flex-col">
        <PageTitle
          title="Pipeline Triggers"
          breadcrumbs={[""]}
          disabledButton={true}
          buttonName=""
          buttonLink=""
          marginBottom="mb-10"
        />

        {/* Status */}

        <div className="flex items-stretch space-x-4">
          <div className="w-1/2">
            <StatusCardsGroup
              type="pipeline"
              statusStats={statusCount}
              isLoading={triggers.isLoading || triggersPrevious.isLoading}
            />
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
                    <Select.Trigger className="z-10 flex w-1/2 flex-row gap-x-2 !rounded-none bg-white">
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
                  refetch={triggers.refetch}
                  selectedTimeOption={selectedTimeOption}
                  setSelectedTimeOption={setSelectedTimeOption}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Chart */}

        <div className="my-8">
          <LineChart
            isLoading={triggers.isLoading}
            pipelines={pipeliesResult}
            selectedTimeOption={selectedTimeOption}
          />
        </div>

        {/* Pipeline Table */}
        <div className="my-4 flex flex-row space-x-8">
          <div className="my-auto mr-auto flex w-3/5 flex-col">
            <h2 className="text-[#101828] text-instill-h2">Pipelines</h2>
            <p>Select pipelines to show triggers</p>
          </div>
        </div>

        <div className="my-4">
          <DashboardPipelinesTable
            pipelines={pipeliesResult}
            isError={triggers.isError || pipelines.isError}
            isLoading={triggers.isLoading || pipelines.isLoading}
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
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
