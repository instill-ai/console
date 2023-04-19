import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  usePipelines,
  useSendAmplitudeData,
  PipelinesTable,
  useCreateUpdateDeleteResourceGuard,
  useWatchPipelines,
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

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const pipelines = usePipelines({
    accessToken: null,
    enable: true,
  });

  const pipelinesWatchState = useWatchPipelines({
    pipelineNames: pipelines.isSuccess ? pipelines.data.map((p) => p.name) : [],
    accessToken: null,
    enable: pipelines.isSuccess,
  });

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  useSendAmplitudeData(
    "hit_pipelines_page",
    { type: "navigation" },
    router.isReady
  );

  return (
    <>
      <PageHead title="pipelines" />
      <PageContentContainer>
        <PageTitle
          title="Pipeline"
          breadcrumbs={["Pipeline"]}
          enableButton={enableGuard ? false : true}
          buttonName="Add new pipeline"
          buttonLink="/pipelines/create"
          marginBottom="mb-10"
        />
        <PipelinesTable
          pipelines={pipelines.data ? pipelines.data : []}
          pipelinesWatchState={
            pipelinesWatchState.isSuccess ? pipelinesWatchState.data : null
          }
          isError={pipelines.isError || pipelinesWatchState.isError}
          marginBottom="mb-5"
        />
      </PageContentContainer>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelinePage;
