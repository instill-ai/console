import { FC, ReactElement, useEffect, useState } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import SourcesTable from "@/services/connector/SourcesTable";
import { useSourcesWithPipelines } from "@/services/connector/SourceServices";
import { useMultiStageQueryLoadingState } from "@/services/useMultiStageQueryLoadingState";

interface GetLayOutProps {
  page: ReactElement;
}

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const sources = useSourcesWithPipelines();

  const isLoading = useMultiStageQueryLoadingState({
    data: sources.data,
    isError: sources.isError,
    isSuccess: sources.isSuccess,
    isLoading: sources.isLoading,
  });

  return (
    <PageContentContainer>
      <PageTitle
        title="Data Sources"
        breadcrumbs={["Data sources"]}
        enableButton={
          sources.data ? (sources.data.length === 0 ? false : true) : false
        }
        buttonName="Add new source"
        buttonLink="/sources/create"
        marginBottom="mb-10"
      />
      <SourcesTable
        sources={sources.data ? sources.data : []}
        isLoadingSources={isLoading}
      />
    </PageContentContainer>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
