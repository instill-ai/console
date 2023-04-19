import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useSendAmplitudeData,
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
  const router = useRouter();

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const sources = useSourcesWithPipelines({
    accessToken: null,
    enable: true,
  });

  const sourcesWatchState = useWatchSources({
    enable: sources.isSuccess,
    sourceNames: sources.isSuccess
      ? sources.data.map((source) => source.name)
      : [],
    accessToken: null,
  });

  useSendAmplitudeData(
    "hit_sources_page",
    { type: "navigation" },
    router.isReady
  );

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
            sourcesWatchState.isSuccess ? sourcesWatchState.data : null
          }
          isError={sources.isError || sourcesWatchState.isError}
          marginBottom={null}
        />
      </PageContentContainer>
    </>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
