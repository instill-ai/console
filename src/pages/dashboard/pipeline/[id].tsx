import React, { FC, ReactElement } from "react";
import { PageTitle, PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { Icons, SingleSelectOption } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";
import { StatusCardsGroup } from "@/components/cards";
import { Status } from "@/types";
import { usePipelineFilter } from "@/pages/api/pipeline/queries";
import { useRouter } from "next/router";
import { getStatusCount, getTimeInRFC3339Format } from "@/lib/dashboard";
import { PipelineTriggerTable } from "@/components/PipelineTriggerTable";
import cn from "clsx";
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
  const [currentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    let queryParams = ``;

    if (selectedTimeOption) {
      const start = getTimeInRFC3339Format(selectedTimeOption.value);
      const stop = getTimeInRFC3339Format("now");
      queryParams += `start='${start}' AND stop='${stop}' AND pipeline_id='${id?.toString()}'`;
    }

    setQueryString(queryParams);
    setCurrentPage(0);
  }, [id, selectedTimeOption]);

  /* -------------------------------------------------------------------------
   * Query pipeline data
   * -----------------------------------------------------------------------*/

  const pipelines = usePipelineFilter({
    enabled: true,
    accessToken: null,
    filter: queryString ? queryString : `pipeline_id='${id?.toString()}'`,
  });

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

        <StatusCardsGroup
          type="pipeline"
          statusStats={statusCount}
          isLoading={pipelines.isLoading}
        />

        {/*Pipeline filters */}

        <div className="CardHeader inline-flex items-center justify-start gap-2.5 self-stretch p-8">
          <div className="LeftContent flex items-center justify-start gap-2.5"></div>
          <div className="RightContent shrink grow basis-0 px-2.5" />
          <FilterByDay
            refetch={pipelines.refetch}
            selectedTimeOption={selectedTimeOption}
            setSelectedTimeOption={setSelectedTimeOption}
          />
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
