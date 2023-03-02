import { FC, ReactElement, useState } from "react";
import { useRouter } from "next/router";

import {
  PipelinesTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
  TableLoadingProgress,
} from "@/components/ui";
import { usePipelines } from "@/services/pipeline";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData, useStateOverviewCounts } from "@/hooks";
import { Nullable } from "@/types/general";
import { useResourcePages } from "@/hooks/useResourcePages";
import { PaginationListContainer } from "@/components/ui/PaginationListContainer";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const pipelines = usePipelines(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState<Nullable<string>>(null);

  const pipelinePages = useResourcePages({
    resources: pipelines.data || null,
    searchTerm,
    pageSize: 2,
  });

  const stateOverviewCounts = useStateOverviewCounts(
    pipelines.isSuccess ? pipelines.data : []
  );

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_pipelines_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="pipelines" />
      <PageContentContainer>
        <PageTitle
          title="Pipeline"
          breadcrumbs={["Pipeline"]}
          enableButton={
            pipelines.data
              ? pipelines.data.length === 0
                ? false
                : true
              : false
          }
          buttonName="Add new pipeline"
          buttonLink="/pipelines/create"
          marginBottom="mb-10"
        />
        <PaginationListContainer
          title="Pipeline"
          description="These are the pipelines you can select"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalPage={pipelinePages.length}
        >
          {pipelines.isSuccess ? (
            <PipelinesTable
              pipelinePages={pipelinePages}
              currentPage={currentPage}
              marginBottom={null}
              stateOverviewCounts={stateOverviewCounts}
            />
          ) : (
            <TableLoadingProgress marginBottom={null} />
          )}
        </PaginationListContainer>
      </PageContentContainer>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelinePage;
