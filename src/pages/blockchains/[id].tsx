import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useConnectorWithPipelines,
  StateLabel,
  PipelinesTable,
  useCreateUpdateDeleteResourceGuard,
  useWatchPipelines,
  useWatchConnector,
  ConfigureBlockchainForm,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const BlockchainDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const blockchainWithPipelines = useConnectorWithPipelines({
    enabled: true,
    connectorName: id ? `connectors/${id.toString()}` : null,
    accessToken: null,
  });

  const blockchainWatchState = useWatchConnector({
    enabled: blockchainWithPipelines.isSuccess,
    connectorName: blockchainWithPipelines.isSuccess
      ? blockchainWithPipelines.data.name
      : null,
    accessToken: null,
  });

  const pipelinesWatchState = useWatchPipelines({
    enabled: blockchainWithPipelines.isSuccess,
    pipelineNames: blockchainWithPipelines.isSuccess
      ? blockchainWithPipelines.data.pipelines.map((pipeline) => pipeline.name)
      : [],
    accessToken: null,
  });

  const isLoadingResources = blockchainWithPipelines.isLoading
    ? true
    : blockchainWithPipelines.isSuccess &&
      blockchainWithPipelines.data.pipelines.length > 0
    ? pipelinesWatchState.isLoading
    : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead
        title={
          blockchainWithPipelines.isLoading
            ? ""
            : (blockchainWithPipelines.data?.name as string)
        }
      />
      <PageTitle
        title={id ? id.toString() : ""}
        breadcrumbs={id ? ["Blockchain", id.toString()] : ["Blockchain"]}
        enableButton={false}
        marginBottom="mb-[50px]"
      />
      <div className="mb-10 flex flex-row gap-x-5">
        <h3 className="my-auto text-black text-instill-h3">State</h3>
        <StateLabel
          enableIcon={true}
          enableBgColor={true}
          state={
            blockchainWatchState.isSuccess
              ? blockchainWatchState.data.state
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
          blockchainWithPipelines.data
            ? blockchainWithPipelines.data.pipelines
            : []
        }
        pipelinesWatchState={
          pipelinesWatchState.isSuccess ? pipelinesWatchState.data : {}
        }
        isError={blockchainWithPipelines.isError || pipelinesWatchState.isError}
        isLoading={isLoadingResources}
        marginBottom="mb-10"
      />
      <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
      {blockchainWithPipelines.isSuccess && blockchainWithPipelines.data ? (
        <ConfigureBlockchainForm
          blockchain={blockchainWithPipelines.data}
          accessToken={null}
          onDelete={() => router.push("/blockchains")}
          onConfigure={null}
          onTestConnection={null}
        />
      ) : null}
    </>
  );
};

BlockchainDetailsPage.getLayout = (page) => {
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

export default BlockchainDetailsPage;
