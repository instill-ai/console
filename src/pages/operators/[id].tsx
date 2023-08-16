import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useConnectorWithPipelines,
  ConfigureSourceForm,
  StateLabel,
  PipelinesTable,
  useCreateUpdateDeleteResourceGuard,
  useWatchPipelines,
  useWatchConnector,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const SourceDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const sourceWithPipelines = useConnectorWithPipelines({
    enabled: true,
    connectorName: id ? `connectors/${id.toString()}` : null,
    accessToken: null,
  });

  const sourceWatchState = useWatchConnector({
    enabled: sourceWithPipelines.isSuccess,
    connectorName: sourceWithPipelines.isSuccess
      ? sourceWithPipelines.data.name
      : null,
    accessToken: null,
  });

  const pipelinesWatchState = useWatchPipelines({
    enabled: sourceWithPipelines.isSuccess,
    pipelineNames: sourceWithPipelines.isSuccess
      ? sourceWithPipelines.data.pipelines.map((pipeline) => pipeline.name)
      : [],
    accessToken: null,
  });

  const isLoadingResources = sourceWithPipelines.isLoading
    ? true
    : sourceWithPipelines.isSuccess &&
      sourceWithPipelines.data.pipelines.length > 0
    ? pipelinesWatchState.isLoading
    : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead
        title={
          sourceWithPipelines.isLoading
            ? ""
            : (sourceWithPipelines.data?.name as string)
        }
      />
      <div className="flex flex-col">
        <PageTitle
          title={id ? id.toString() : ""}
          breadcrumbs={id ? ["Operator", id.toString()] : ["Operator"]}
          disabledButton={true}
          marginBottom="mb-[50px]"
        />
        <div className="mb-10 flex flex-row gap-x-5">
          <h3 className="my-auto text-black text-instill-h3">State</h3>
          <StateLabel
            enableIcon={true}
            enableBgColor={true}
            state={
              sourceWatchState.isSuccess
                ? sourceWatchState.data.state
                : "STATE_UNSPECIFIED"
            }
            iconHeight="h-[18px]"
            iconWidth="w-[18px]"
            iconPosition="my-auto"
          />
        </div>
        <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
        <PipelinesTable
          pipelines={
            sourceWithPipelines.data ? sourceWithPipelines.data.pipelines : []
          }
          pipelinesWatchState={
            pipelinesWatchState.isSuccess ? pipelinesWatchState.data : {}
          }
          isError={sourceWithPipelines.isError || pipelinesWatchState.isError}
          isLoading={isLoadingResources}
          marginBottom="mb-10"
          accessToken={null}
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        {sourceWithPipelines.isSuccess && sourceWatchState.isSuccess ? (
          <ConfigureSourceForm
            width="w-full"
            source={{
              ...sourceWithPipelines.data,
              watchState: sourceWatchState.data.state,
            }}
            onDelete={(initStore) => {
              initStore();
              router.push("/operators");
            }}
            onConfigure={null}
            disabledDelete={enableGuard}
            accessToken={null}
            disabledConfigure={true}
          />
        ) : null}
      </div>
    </>
  );
};

SourceDetailsPage.getLayout = (page) => {
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

export default SourceDetailsPage;
