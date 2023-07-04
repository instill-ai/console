import React, { FC, ReactElement } from "react";
import { PageTitle, PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { StatusCardsGroup } from "@/components/cards";
import { pipelines } from "@/lib/mocks";
import { Status } from "@/types";
import {
  defaultSelectOption,
  getPipeLineOptions,
  getPipelinesTriggerCount,
  getStatusCount,
  modeOptions,
  statusOptions,
} from "@/lib/dashboard";
import { DashboardPipelinesTable } from "@/components/DashboardPipelinesTable";
import { LineChart } from "@/components/charts";
import { Select, SingleSelectOption } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  /* -------------------------------------------------------------------------
   * Get the pipeline definition and static state for fields
   * -----------------------------------------------------------------------*/

  const [selectedTimeOption, setSelectedTimeOption] = React.useState<
    Nullable<SingleSelectOption>
  >({
    label: "24h",
    value: "24h",
  });
  const [selectedPinelineOption, setSelectedPinelineOption] =
    React.useState<Nullable<SingleSelectOption>>(defaultSelectOption);
  const [selectedModeOption, setSelectedModeOption] =
    React.useState<Nullable<SingleSelectOption>>(defaultSelectOption);
  const [selectedStatusOption, setSelectedStatusOption] =
    React.useState<Nullable<SingleSelectOption>>(defaultSelectOption);

  const pipelineOptions = React.useMemo<SingleSelectOption[]>(() => {
    return getPipeLineOptions(pipelines);
  }, [pipelines]);

  const statusCount = React.useMemo<Status[]>(() => {
    return getStatusCount(pipelines);
  }, [pipelines]);

  /* -------------------------------------------------------------------------
   * Query pipeline data
   * -----------------------------------------------------------------------*/

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

        <StatusCardsGroup type="pipeline" statusStats={statusCount} />

        {/* Pipeline Chart */}

        <div className="my-8">
          <LineChart pipelines={pipelines} />
        </div>
        {/* Filter for graph */}

        <div className="my-4 flex flex-row space-x-8">
          <div className="my-auto mr-auto flex w-3/5 flex-col">
            <h2 className="text-[#101828] text-instill-h2">Pipelines</h2>
            <p>Select pipelines to show triggers</p>
          </div>

          <div className="my-4 flex w-2/5 flex-row space-x-8">
            <Select.Root>
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
                      onChange={() => {
                        setSelectedStatusOption(statusOption);
                      }}
                    >
                      {statusOption.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>

            <Select.Root>
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
                      onChange={() => {
                        setSelectedPinelineOption(pipelineOption);
                      }}
                    >
                      {pipelineOption.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>

            <Select.Root>
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
                      onChange={() => {
                        setSelectedModeOption(modeOption);
                      }}
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
            pipelines={getPipelinesTriggerCount(pipelines)}
            isError={false}
            isLoading={false}
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
