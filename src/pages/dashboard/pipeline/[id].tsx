import React, { FC, ReactElement } from "react";
import { PageTitle, PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";
import { StatusCardsGroup } from "@/components/cards";
import { Status, StatusCount } from "@/types";
import { useRouter } from "next/router";
import {
  defaultStatusCount,
  getPreviousTime,
  getStatusCount,
  getTimeInRFC3339Format,
  usePipelineTriggersMetric,
} from "@/lib/dashboard";
import { PipelineTriggerTable } from "@/components/PipelineTriggerTable";
import { FilterByDay } from "@/components/filter/FilterByDay";

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
    React.useState<SingleSelectOption>({
      label: "24h",
      value: "24h",
    });

  const [queryString, setQueryString] = React.useState<Nullable<string>>("");
  const [queryStringPrevious, setQueryStringPrevious] =
    React.useState<Nullable<string>>("");
  const [currentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    let queryParams = ``;
    let queryParamsPrevious = "";

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(selectedTimeOption.value);
      const stop = getTimeInRFC3339Format("now");
      const previousTime = getTimeInRFC3339Format(
        getPreviousTime(selectedTimeOption.value)
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

  const pipelines = usePipelineTriggersMetric({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : `pipeline_id='${id?.toString()}'`,
  });

  const pipelinesPrevious = usePipelineTriggersMetric({
    enabled: true,
    accessToken: null,
    filter: queryStringPrevious
      ? queryStringPrevious
      : `pipeline_id='${id?.toString()}'`,
  });

  const statusCount = React.useMemo<StatusCount>(() => {
    if (pipelines.data && pipelinesPrevious.data) {
      return getStatusCount(pipelines.data, pipelinesPrevious.data);
    }
    return defaultStatusCount;
  }, [pipelines.data, pipelinesPrevious.data]);

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
            <StatusCardsGroup
              type="pipeline"
              statusStats={statusCount}
              isLoading={pipelines.isLoading || pipelines.isLoading}
            />
          </div>
          {/* Filter for graph */}
          <div className="w-1/2 self-end">
            <div className="my-1">
              <FilterByDay
                refetch={pipelines.refetch}
                selectedTimeOption={selectedTimeOption}
                setSelectedTimeOption={setSelectedTimeOption}
              />
            </div>
          </div>
        </div>

        {/* Pipeline Table */}

        <div className="my-8">
          <PipelineTriggerTable
            pipelines={pipelines?.data ? pipelines.data : []}
            isError={pipelines.isError}
            isLoading={pipelines.isLoading}
            statusCount={statusCount}
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
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
