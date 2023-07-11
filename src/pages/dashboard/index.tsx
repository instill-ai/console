import React, { FC, ReactElement } from "react";
import { PageTitle, PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { StatusCardsGroup } from "@/components/cards";
import { Status } from "@/types";
import {
  defaultSelectOption,
  formatTriggerCount,
  getPipeLineOptions,
  getPipelinesTriggerCount,
  getPreviousTime,
  getStatusCount,
  getTimeInRFC3339Format,
  modeOptions,
  statusOptions,
  usePipelineFilter,
} from "@/lib/dashboard";
import { DashboardPipelinesTable } from "@/components/DashboardPipelinesTable";
import { LineChart } from "@/components/charts";
import { Select, SingleSelectOption } from "@instill-ai/design-system";
import { Nullable, usePipelines } from "@instill-ai/toolkit";

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
    React.useState<SingleSelectOption>({
      label: "Today",
      value: "24h",
    });
  const [selectedPinelineOption, setSelectedPinelineOption] =
    React.useState<Nullable<SingleSelectOption>>(defaultSelectOption);
  const [selectedModeOption, setSelectedModeOption] =
    React.useState<SingleSelectOption>(defaultSelectOption);
  const [selectedStatusOption, setSelectedStatusOption] =
    React.useState<Nullable<SingleSelectOption>>(defaultSelectOption);
  const [queryString, setQueryString] = React.useState<Nullable<string>>("");
  const [queryStringPrevious, setQueryStringPrevious] =
    React.useState<Nullable<string>>("");

  React.useEffect(() => {
    let queryParams = "";
    let queryParamsPrevious = "";

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(selectedTimeOption.value);
      const stop = getTimeInRFC3339Format("now");
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
    if (selectedModeOption && selectedModeOption.value !== "all") {
      if (queryParams) {
        queryParams += ` AND pipeline_mode=${selectedModeOption.value}`;
        queryParamsPrevious += ` AND pipeline_mode=${selectedModeOption.value}`;
      } else {
        queryParams += `pipeline_mode=${selectedModeOption.value}`;
        queryParamsPrevious += `pipeline_mode=${selectedModeOption.value}`;
      }
    }
    if (selectedPinelineOption && selectedPinelineOption.value !== "all") {
      if (queryParams) {
        queryParams += ` AND pipeline_id='${selectedPinelineOption.label}'`;
        queryParamsPrevious += ` AND pipeline_id='${selectedPinelineOption.label}'`;
      } else {
        queryParams += `pipeline_id='${selectedPinelineOption.label}'`;
        queryParamsPrevious += `pipeline_id='${selectedPinelineOption.label}'`;
      }
    }
    if (selectedStatusOption && selectedStatusOption.value !== "all") {
      if (queryParams) {
        queryParams += ` AND status=${selectedStatusOption.value}`;
        queryParamsPrevious += ` AND status=${selectedStatusOption.value}`;
      } else {
        queryParams += `status=${selectedStatusOption.value}`;
        queryParamsPrevious += `status=${selectedStatusOption.value}`;
      }
    }

    setQueryString(queryParams);
    setQueryStringPrevious(queryParamsPrevious);
  }, [
    selectedTimeOption,
    selectedModeOption,
    selectedPinelineOption,
    selectedStatusOption,
  ]);

  /* -------------------------------------------------------------------------
   * Query pipeline and triggers data
   * -----------------------------------------------------------------------*/

  const pipelines = usePipelines({
    enabled: true,
    accessToken: null,
  });

  const triggers = usePipelineFilter({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : null,
  });

  const triggersPrevious = usePipelineFilter({
    enabled: true,
    accessToken: null,
    filter: queryStringPrevious ? queryStringPrevious : null,
  });

  const pipelineOptions = React.useMemo<SingleSelectOption[]>(() => {
    if (pipelines.data) {
      return getPipeLineOptions(pipelines.data);
    }
    return [];
  }, [triggers.data]);

  console.log("formatTriggerCount", formatTriggerCount(triggers.data || []));

  const statusCount = React.useMemo<Status[]>(() => {
    if (triggers.data && triggersPrevious.data) {
      return getStatusCount(triggers.data, triggersPrevious.data);
    }
    return [];
  }, [triggers.data, triggersPrevious.data]);

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

        <StatusCardsGroup
          type="pipeline"
          statusStats={statusCount}
          isLoading={triggers.isLoading || triggersPrevious.isLoading}
        />

        {/* Pipeline Chart */}

        <div className="my-8">
          <LineChart
            triggers={triggers?.data ? triggers?.data : []}
            isLoading={triggers.isLoading}
            selectedTimeOption={selectedTimeOption}
            setSelectedTimeOption={setSelectedTimeOption}
            refetch={triggers.refetch}
          />
        </div>

        {/* Filter for graph */}

        <div className="my-4 flex flex-row space-x-8">
          <div className="my-auto mr-auto flex w-3/5 flex-col">
            <h2 className="text-[#101828] text-instill-h2">Pipelines</h2>
            <p>Select pipelines to show triggers</p>
          </div>

          <div className="my-4 flex w-2/5 flex-row space-x-8">
            <Select.Root
              defaultValue={"all"}
              value={selectedPinelineOption?.value}
              onValueChange={(pipelineOption) => {
                setSelectedPinelineOption({
                  label: pipelineOption,
                  value: pipelineOption,
                });
              }}
            >
              <Select.Trigger className="z-10 flex w-full flex-row gap-x-2 !rounded-none bg-white">
                <Select.Value
                  placeholder="ID: All"
                  className="z-10 flex w-full flex-row gap-x-2"
                />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {pipelineOptions.map((pipelineOption) => (
                    <Select.Item
                      value={pipelineOption.value}
                      key={pipelineOption.value}
                    >
                      {pipelineOption.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>

            <Select.Root
              defaultValue={modeOptions[0].value}
              onValueChange={(modeOption) => {
                setSelectedModeOption({ label: modeOption, value: modeOption });
              }}
            >
              <Select.Trigger className="z-10 flex w-full flex-row gap-x-2 !rounded-none bg-white">
                <Select.Value
                  placeholder="Mode: All"
                  className="z-10 flex w-full flex-row gap-x-2"
                />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {modeOptions.map((modeOption) => (
                    <Select.Item
                      value={modeOption.value}
                      key={modeOption.value}
                    >
                      {modeOption.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        {/* Pipeline Table */}

        <div className="my-4">
          <DashboardPipelinesTable
            pipelines={
              triggers.data && pipelines.data
                ? getPipelinesTriggerCount(triggers.data, pipelines.data)
                : []
            }
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
