import React, { FC, ReactElement } from "react";
import { PageTitle, PageBase, PageHead, Sidebar, Topbar } from "@/components";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";
import { StatusCardsGroup } from "@/components/cards";
import { Status } from "@/types";
import { usePipelineFilter } from "@/pages/api/pipeline/queries";
import { useRouter } from "next/router";
import { getStatusCount } from "@/lib/dashboard";
import { PipelineTriggerTable } from "@/components/PipelineTriggerTable";

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

  const [selectedTimeOption, setSelectedTimeOption] = React.useState<
    Nullable<SingleSelectOption>
  >({
    label: "24h",
    value: "24h",
  });
  const [queryString, setQueryString] = React.useState<Nullable<string>>("");

  React.useEffect(() => {
    const queryParams = "";

    setQueryString(queryParams);
  }, [selectedTimeOption]);

  /* -------------------------------------------------------------------------
   * Query pipeline data
   * -----------------------------------------------------------------------*/

  var pipelines = usePipelineFilter({
    accessToken: null,
    enabled: true,
    filter: `pipeline_id=${id ? id.toString() : null}`,
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

  if (!router.query.id) {
    return null;
  }

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

        {/* Pipeline Table */}

        <div className="my-8">
          <PipelineTriggerTable
            pipelines={pipelines?.data ? pipelines.data : []}
            isError={pipelines.isError}
            isLoading={pipelines.isLoading}
            statusCount={statusCount}
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
