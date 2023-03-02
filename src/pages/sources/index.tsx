import { FC, ReactElement, useState } from "react";
import { useRouter } from "next/router";

import {
  SourcesTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
  TableLoadingProgress,
} from "@/components/ui";
import { useSourcesWithPipelines } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData, useStateOverviewCounts } from "@/hooks";
import { Nullable } from "@/types/general";
import { useResourcePages } from "@/hooks/useResourcePages";
import { PaginationListContainer } from "@/components/ui/PaginationListContainer";

type GetLayOutProps = {
  page: ReactElement;
};

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const sources = useSourcesWithPipelines();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState<Nullable<string>>(null);

  const sourcePages = useResourcePages({
    resources: sources.data || null,
    searchTerm,
    pageSize: 1,
  });

  const stateOverviewCounts = useStateOverviewCounts(
    sources.isSuccess ? sources.data : []
  );

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_sources_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="source-connectors" />
      <PageContentContainer>
        <PageTitle
          title="Source"
          breadcrumbs={["Source"]}
          enableButton={
            sources.data ? (sources.data.length === 0 ? false : true) : false
          }
          buttonName="Set up new source"
          buttonLink="/sources/create"
          marginBottom="mb-10"
        />
        <PaginationListContainer
          title="Source"
          description="These are the sources you can select"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalPage={sourcePages.length}
        >
          {sources.isSuccess ? (
            <SourcesTable
              sourcePages={sourcePages}
              marginBottom={null}
              currentPage={currentPage}
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

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
