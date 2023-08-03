import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";
import {
  useConnectorWithPipelines,
  useWarnUnsavedChanges,
  ConfigureDestinationForm,
  useCreateResourceFormStore,
  PipelinesTable,
  StateLabel,
  CreateResourceFormStore,
  useCreateUpdateDeleteResourceGuard,
  useWatchPipelines,
  useWatchConnector,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

const selector = (state: CreateResourceFormStore) => ({
  formIsDirty: state.formIsDirty,
});

type GetLayOutProps = {
  page: ReactElement;
};

const DestinationDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  const { formIsDirty } = useCreateResourceFormStore(selector, shallow);

  useWarnUnsavedChanges({
    router,
    haveUnsavedChanges: formIsDirty,
    confirmation:
      "You have unsaved changes, are you sure you want to leave this page?",
    callbackWhenLeave: null,
  });

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const destinationWithPipelines = useConnectorWithPipelines({
    connectorName: id ? `connectors/${id.toString()}` : null,
    accessToken: null,
    enabled: true,
  });

  const destinationWatchState = useWatchConnector({
    connectorName: destinationWithPipelines.isSuccess
      ? destinationWithPipelines.data.name
      : null,
    accessToken: null,
    enabled: destinationWithPipelines.isSuccess,
  });

  const pipelinesWatchState = useWatchPipelines({
    pipelineNames: destinationWithPipelines.isSuccess
      ? destinationWithPipelines.data.pipelines.map((pipeline) => pipeline.name)
      : [],
    accessToken: null,
    enabled: destinationWithPipelines.isSuccess,
  });

  const isLoadingResources = destinationWithPipelines.isLoading
    ? true
    : destinationWithPipelines.isSuccess &&
      destinationWithPipelines.data.pipelines.length > 0
    ? pipelinesWatchState.isLoading
    : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead
        title={
          destinationWithPipelines.isLoading
            ? ""
            : (destinationWithPipelines.data?.name as string)
        }
      />
      <div className="flex flex-col">
        <PageTitle
          title={id ? id.toString() : ""}
          breadcrumbs={id ? ["Data", id.toString()] : ["Data"]}
          disabledButton={true}
          marginBottom="mb-[50px]"
        />
        <div className="mb-10 flex flex-row gap-x-5">
          <h3 className="my-auto text-black text-instill-h3">State</h3>
          <StateLabel
            enableIcon={true}
            enableBgColor={true}
            state={
              destinationWatchState.isSuccess
                ? destinationWatchState.data.state
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
            destinationWithPipelines.isSuccess
              ? destinationWithPipelines.data.pipelines
              : []
          }
          pipelinesWatchState={
            pipelinesWatchState.isSuccess ? pipelinesWatchState.data : {}
          }
          isError={
            destinationWithPipelines.isError || pipelinesWatchState.isError
          }
          isLoading={isLoadingResources}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        {destinationWithPipelines.isSuccess &&
        destinationWatchState.isSuccess ? (
          <ConfigureDestinationForm
            destination={{
              ...destinationWithPipelines.data,
              watchState: destinationWatchState.data.state,
            }}
            onDelete={(initStore) => {
              initStore();
              router.push("/data");
            }}
            disabledDelete={enableGuard}
            onConfigure={null}
            disabledConfigure={enableGuard}
            width="w-full"
            accessToken={null}
          />
        ) : null}
      </div>
    </>
  );
};

DestinationDetailsPage.getLayout = (page) => {
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

export default DestinationDetailsPage;
