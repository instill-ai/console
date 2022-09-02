import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import {
  PipelinesTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { usePipelines } from "@/services/pipeline";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const pipelines = usePipelines(true);

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const router = useRouter();
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
        <PipelinesTable
          pipelines={pipelines.data ? pipelines.data : []}
          isLoadingPipeline={pipelines.isLoading}
          marginBottom={null}
          enablePlaceholderCreateButton={true}
        />
      </PageContentContainer>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelinePage;
