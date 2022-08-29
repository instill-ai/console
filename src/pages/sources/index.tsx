import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import { PageBase, PageContentContainer } from "@/components/layouts";
import { SourcesTable, PageTitle } from "@/components/ui";
import { useMultiStageQueryLoadingState } from "@/hooks/useMultiStageQueryLoadingState";
import { useSourcesWithPipelines } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";
import PageHead from "@/components/layouts/PageHead";

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

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const router = useRouter();
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
        <SourcesTable
          sources={sources.data ? sources.data : []}
          isLoadingSources={isLoading}
          marginBottom={null}
          enablePlaceholderCreateButton={true}
        />
      </PageContentContainer>
    </>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
