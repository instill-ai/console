import { FC, ReactElement } from "react";
import {
  useConnectorsWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
  AIsTable,
  BlockchainsTable,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const BlockchainsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const blockchains = useConnectorsWithPipelines({
    connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
    enabled: true,
    accessToken: null,
  });

  const blockchainsWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_AI",
    enabled: blockchains.isSuccess,
    connectorNames: blockchains.isSuccess
      ? blockchains.data.map((blockchain) => blockchain.name)
      : [],
    accessToken: null,
  });

  const isLoadingResource =
    blockchains.isLoading ||
    (blockchains.isSuccess && blockchains.data.length > 0)
      ? blockchainsWatchState.isLoading
      : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="ai-connectors" />
      <div className="flex flex-col">
        <PageTitle
          title=""
          breadcrumbs={[""]}
          enableButton={enableGuard ? false : true}
          buttonName="Set up new Blockchain"
          buttonLink="/blockchains/create"
          marginBottom="mb-10"
        />
        <BlockchainsTable
          blockchains={blockchains.data ? blockchains.data : []}
          blockchainsWatchState={
            blockchainsWatchState.isSuccess ? blockchainsWatchState.data : {}
          }
          isError={blockchains.isError || blockchainsWatchState.isError}
          isLoading={isLoadingResource}
        />
      </div>
    </>
  );
};

export default BlockchainsPage;

BlockchainsPage.getLayout = (page) => {
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
