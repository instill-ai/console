import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useConnectorResourceWithPipelines,
  StateLabel,
  PipelinesTable,
  useWatchPipelines,
  useWatchConnectorResource,
  ConfigureAIForm,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const AIDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const aiWithPipelines = useConnectorResourceWithPipelines({
    enabled: true,
    connectorResourceName: id ? `connector-resources/${id.toString()}` : null,
    accessToken: null,
  });

  const aiWatchState = useWatchConnectorResource({
    enabled: aiWithPipelines.isSuccess,
    connectorResourceName: aiWithPipelines.isSuccess
      ? aiWithPipelines.data.name
      : null,
    accessToken: null,
  });

  const pipelinesWatchState = useWatchPipelines({
    enabled: aiWithPipelines.isSuccess,
    pipelineNames: aiWithPipelines.isSuccess
      ? aiWithPipelines.data.pipelines.map((pipeline) => pipeline.name)
      : [],
    accessToken: null,
  });

  const isLoadingResources = aiWithPipelines.isLoading
    ? true
    : aiWithPipelines.isSuccess && aiWithPipelines.data.pipelines.length > 0
    ? pipelinesWatchState.isLoading
    : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead
        title={
          aiWithPipelines.isLoading
            ? ""
            : (aiWithPipelines.data?.name as string)
        }
      />
      <PageTitle
        title={id ? id.toString() : ""}
        breadcrumbs={id ? ["AI", id.toString()] : ["AI"]}
        disabledButton={true}
        marginBottom="mb-[50px]"
      />
      <div className="mb-10 flex flex-row gap-x-5">
        <h3 className="my-auto text-black text-instill-h3">State</h3>
        <StateLabel
          enableIcon={true}
          enableBgColor={true}
          state={
            aiWatchState.isSuccess
              ? aiWatchState.data.state
              : "STATE_UNSPECIFIED"
          }
          iconHeight="h-[18px]"
          iconWidth="w-[18px]"
          iconPosition="my-auto"
        />
      </div>
      <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
      <PipelinesTable
        pipelines={aiWithPipelines.data ? aiWithPipelines.data.pipelines : []}
        pipelinesWatchState={
          pipelinesWatchState.isSuccess ? pipelinesWatchState.data : {}
        }
        isError={aiWithPipelines.isError || pipelinesWatchState.isError}
        isLoading={isLoadingResources}
        accessToken={null}
      />
      <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
      {aiWithPipelines.isSuccess && aiWatchState.isSuccess ? (
        <ConfigureAIForm
          ai={{ ...aiWithPipelines.data, watchState: aiWatchState.data.state }}
          accessToken={null}
          onDelete={() => router.push("/ais")}
          onConfigure={null}
          onTestConnection={null}
        />
      ) : null}
    </>
  );
};

AIDetailsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default AIDetailsPage;
