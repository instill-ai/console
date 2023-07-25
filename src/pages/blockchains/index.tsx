import { FC, ReactElement } from "react";
import {
  useConnectorsWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { BlockchainsTable } from "@/components/BlockchainsTable";
import { Button, Icons } from "@instill-ai/design-system";
import Router from "next/router";

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
        <div className="mb-4">
          <Button
            className="gap-x-2"
            variant="primary"
            size="lg"
            onClick={() => Router.push("/blockchains/create")}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            Add Blockchain
          </Button>
        </div>

        <div className="my-4 flex flex-col space-y-2">
          <h4 className="w-full text-semantic-fg-primary product-body-text-1-semibold">
            Blockchain
          </h4>
          <p className="w-full text-semantic-fg-disabled product-body-text-3-regular">
            These are the blockchains you can select
          </p>
        </div>

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
        <PageBase.Content contentPadding="p-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
