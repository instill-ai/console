import { FC, ReactElement } from "react";
import {
  BlockchainsTable,
  useConnectorResourcesWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectorResources,
} from "@instill-ai/toolkit";

import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { Button, Icons } from "@instill-ai/design-system";
import { useRouter } from "next/router";

type GetLayOutProps = {
  page: ReactElement;
};

const BlockchainsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const routes = useRouter();
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const blockchains = useConnectorResourcesWithPipelines({
    connectorResourceType: "CONNECTOR_TYPE_BLOCKCHAIN",
    enabled: true,
    accessToken: null,
  });

  const blockchainsWatchState = useWatchConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_AI",
    enabled: blockchains.isSuccess,
    connectorResourceNames: blockchains.isSuccess
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
        <div className="mb-14">
          <Button
            className="gap-x-2"
            variant="primary"
            size="lg"
            onClick={() => {
              if (!enableGuard) routes.push("/blockchains/create");
            }}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            Add Blockchain
          </Button>
        </div>

        <BlockchainsTable
          blockchains={blockchains.data ? blockchains.data : []}
          blockchainsWatchState={
            blockchainsWatchState.isSuccess ? blockchainsWatchState.data : {}
          }
          isError={blockchains.isError || blockchainsWatchState.isError}
          isLoading={isLoadingResource}
          accessToken={null}
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
