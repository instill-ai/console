import { FC, ReactElement } from "react";
import {
  useSourcesWithPipelines,
  SourcesTable,
  useCreateUpdateDeleteResourceGuard,
  useWatchSources,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const sources = useSourcesWithPipelines({
    enabled: true,
    accessToken: null,
  });

  const sourcesWatchState = useWatchSources({
    enabled: sources.isSuccess,
    sourceNames: sources.isSuccess
      ? sources.data.map((source) => source.name)
      : [],
    accessToken: null,
  });

  const isLoadingResource =
    sources.isLoading || (sources.isSuccess && sources.data.length > 0)
      ? sourcesWatchState.isLoading
      : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="source-connectors" />
      <PageContentContainer>
        <PageTitle
          title="Source"
          breadcrumbs={["Source"]}
          enableButton={enableGuard ? false : true}
          buttonName="Set up new source"
          buttonLink="/sources/create"
          marginBottom="mb-10"
        />
        <SourcesTable
          sources={sources.data ? sources.data : []}
          sourcesWatchState={
            sourcesWatchState.isSuccess ? sourcesWatchState.data : {}
          }
          isError={sources.isError || sourcesWatchState.isError}
          isLoading={isLoadingResource}
        />
      </PageContentContainer>
    </>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
