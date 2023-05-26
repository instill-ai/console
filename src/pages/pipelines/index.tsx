import { FC, ReactElement } from "react";
import {
  usePipelines,
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
  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const pipelines = usePipelines({
    enabled: true,
    accessToken: null,
  });

  const pipelinesWatchState = useWatchPipelines({
    enabled: pipelines.isSuccess,
    pipelineNames: pipelines.isSuccess ? pipelines.data.map((p) => p.name) : [],
    accessToken: null,
  });

  const isLoadingResource =
    pipelines.isLoading || (pipelines.isSuccess && pipelines.data.length > 0)
      ? pipelinesWatchState.isLoading
      : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

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
            pipelinesWatchState.isSuccess ? pipelinesWatchState.data : {}
          }
          isError={pipelines.isError || pipelinesWatchState.isError}
          marginBottom="mb-5"
          isLoading={isLoadingResource}
        />
      </PageContentContainer>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelinePage;
