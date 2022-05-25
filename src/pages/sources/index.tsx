import { FC, ReactElement, useEffect, useState } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import SourcesTable from "@/services/connector/SourcesTable";
import { useSourcesWithPipelines } from "@/services/connector/SourceServices";

interface GetLayOutProps {
  page: ReactElement;
}

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const [isLoadingSources, setIsLoadingSources] = useState(true);

  const sources = useSourcesWithPipelines();

  useEffect(() => {
    console.log(
      sources.isError,
      sources.isSuccess,
      sources.isIdle,
      sources.isLoading
    );
    if (sources.isError || sources.isSuccess) {
      setIsLoadingSources(false);
      return;
    }

    if (sources.isLoading) {
      setIsLoadingSources(true);
      return;
    }
  }, [sources.isError, sources.isSuccess, sources.isLoading]);

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
        isLoadingSources={isLoadingSources}
      />
    </PageContentContainer>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
