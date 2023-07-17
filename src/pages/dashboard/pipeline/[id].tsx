import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { PageTitle, PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { SingleSelectOption } from "@instill-ai/design-system";
import {
  getPipelineTriggersSummary,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  usePipelineTriggerRecords,
  PipelineTriggersTable,
  PipelineTriggersSummary,
  FilterByDay,
  DashboardAvailableTimeframe,
  type Nullable,
} from "@instill-ai/toolkit";
import { useRouter } from "next/router";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  /* -------------------------------------------------------------------------
   * Get the pipeline definition and static state for fields
   * -----------------------------------------------------------------------*/

  const [selectedTimeOption, setSelectedTimeOption] =
    useState<SingleSelectOption>({
      label: "24h",
      value: "24h",
    });

  const [queryString, setQueryString] = useState<Nullable<string>>("");
  const [queryStringPrevious, setQueryStringPrevious] =
    useState<Nullable<string>>("");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
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
    setCurrentPage(0);
  }, [id, selectedTimeOption]);

  /* -------------------------------------------------------------------------
   * Query pipeline data
   * -----------------------------------------------------------------------*/

  const pipelineTriggerRecords = usePipelineTriggerRecords({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : `pipeline_id='${id?.toString()}'`,
  });

  const previousPipelineTriggerRecords = usePipelineTriggerRecords({
    enabled: true,
    accessToken: null,
    filter: queryStringPrevious
      ? queryStringPrevious
      : `pipeline_id='${id?.toString()}'`,
  });

  const pipelineTriggersSummary = useMemo(() => {
    if (
      !pipelineTriggerRecords.isSuccess ||
      !previousPipelineTriggerRecords.isSuccess
    ) {
      return null;
    }

    return getPipelineTriggersSummary(
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
    <>
      <PageHead title="pineline name" />
      <div className="flex flex-col">
        <PageTitle
          title="Pipeline Name"
          breadcrumbs={[""]}
          disabledButton={true}
          buttonName=""
          buttonLink=""
          marginBottom="mb-10"
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
                  pipelineTriggersSummary
                    ? pipelineTriggersSummary.errored
                    : null
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

        <div className="my-8">
          <PipelineTriggersTable
            pipelineTriggers={
              pipelineTriggerRecords.isSuccess
                ? pipelineTriggerRecords.data
                : []
            }
            isError={pipelineTriggerRecords.isError}
            isLoading={pipelineTriggerRecords.isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
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
