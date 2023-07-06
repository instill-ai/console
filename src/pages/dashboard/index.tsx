import React, { FC, ReactElement } from "react";
import { PageTitle, PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { StatusCardsGroup } from "@/components/cards";
import { Status } from "@/types";
import {
  defaultSelectOption,
  getPipeLineOptions,
  getPipelinesTriggerCount,
  getStatusCount,
  getTimeInRFC3339Format,
  modeOptions,
  statusOptions,
} from "@/lib/dashboard";
import { DashboardPipelinesTable } from "@/components/DashboardPipelinesTable";
import { LineChart } from "@/components/charts";
import { Select, SingleSelectOption } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";
import { usePipelineFilter } from "../api/pipeline/queries";

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

  React.useEffect(() => {
    let queryParams = "";

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(selectedTimeOption.value);
      const stop = getTimeInRFC3339Format("now");

      if (queryParams) {
        queryParams += ` AND start='${start}' AND stop='${stop}'`;
      } else {
        queryParams += `start='${start}' AND stop='${stop}'`;
      }
    }
    if (selectedModeOption && selectedModeOption.value !== "all") {
      if (queryParams) {
        queryParams += ` AND pipeline_mode=${selectedModeOption.value}`;
      } else {
        queryParams += `pipeline_mode=${selectedModeOption.value}`;
      }
    }
    if (selectedPinelineOption && selectedPinelineOption.value !== "all") {
      if (queryParams) {
        queryParams += ` AND pipeline_id='${selectedPinelineOption.label}'`;
      } else {
        queryParams += `pipeline_id='${selectedPinelineOption.label}'`;
      }
    }
    if (selectedStatusOption && selectedStatusOption.value !== "all") {
      if (queryParams) {
        queryParams += ` AND status=${selectedStatusOption.value}`;
      } else {
        queryParams += `status=${selectedStatusOption.value}`;
      }
    }

    setQueryString(queryParams);
  }, [
    selectedTimeOption,
    selectedModeOption,
    selectedPinelineOption,
    selectedStatusOption,
  ]);

  console.log("queryParams", queryString);

  /* -------------------------------------------------------------------------
   * Query pipeline data
   * -----------------------------------------------------------------------*/

  const pipelines = usePipelineFilter({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : null,
  });

  const pipelineOptions = React.useMemo<SingleSelectOption[]>(() => {
    if (pipelines.data) {
      return getPipeLineOptions(pipelines.data);
    }
    return [];
  }, [pipelines.data]);

  const statusCount = React.useMemo<Status[]>(() => {
    if (pipelines.data) {
      return getStatusCount(pipelines.data);
    }
    return [];
  }, [pipelines.data]);

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
          isLoading={pipelines.isLoading}
        />

        {/* Pipeline Chart */}

        <div className="my-8">
          <LineChart
            pipelines={pipelines?.data ? pipelines?.data : []}
            isLoading={pipelines.isLoading}
            selectedTimeOption={selectedTimeOption}
            setSelectedTimeOption={setSelectedTimeOption}
            refetch={pipelines.refetch}
          />
        </div>

        {/* Filter for graph */}

        <div className="my-4 flex flex-row space-x-8">
          <div className="my-auto mr-auto flex w-3/5 flex-col">
            <h2 className="text-[#101828] text-instill-h2">Pipelines</h2>
            <p>Select pipelines to show triggers</p>
          </div>

          <div className="my-4 flex w-2/5 flex-row space-x-8">
            {/* <Select.Root
              defaultValue={"all"}
              onValueChange={(statusOption) => {
                setSelectedStatusOption({
                  label: statusOption,
                  value: statusOption,
                });
              }}
            >
              <Select.Trigger className="z-10 flex w-full flex-row gap-x-2 !rounded-none bg-white">
                <Select.Value
                  placeholder="Status: All"
                  className="z-10 flex w-full flex-row gap-x-2"
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
            </Select.Root> */}

            <Select.Root
              defaultValue={"all"}
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
              pipelines?.data ? getPipelinesTriggerCount(pipelines.data) : []
            }
            isError={pipelines.isError}
            isLoading={pipelines.isLoading}
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
