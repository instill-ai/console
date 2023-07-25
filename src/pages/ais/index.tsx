import { FC, ReactElement } from "react";
import {
  useConnectorsWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { AIsTable } from "@/components/AIsTable";
import { Button, Icons } from "@instill-ai/design-system";
import Router from "next/router";

type GetLayOutProps = {
  page: ReactElement;
};

const AIsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const ais = useConnectorsWithPipelines({
    connectorType: "CONNECTOR_TYPE_AI",
    enabled: true,
    accessToken: null,
  });

  const aisWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_AI",
    enabled: ais.isSuccess,
    connectorNames: ais.isSuccess ? ais.data.map((ai) => ai.name) : [],
    accessToken: null,
  });

  const isLoadingResource =
    ais.isLoading || (ais.isSuccess && ais.data.length > 0)
      ? aisWatchState.isLoading
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
            onClick={() => Router.push("/ais/create")}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            Add AI Connector
          </Button>
        </div>

        <div className="my-4 flex flex-col space-y-2">
          <h4 className="w-full text-semantic-fg-primary product-body-text-1-semibold">
            AI
          </h4>
          <p className="w-full text-semantic-fg-disabled product-body-text-3-regular">
            Check and organise your AI connectors
          </p>
        </div>
        <AIsTable
          ais={ais.data ? ais.data : []}
          aisWatchState={aisWatchState.isSuccess ? aisWatchState.data : {}}
          isError={ais.isError || aisWatchState.isError}
          isLoading={isLoadingResource}
        />
      </div>
    </>
  );
};

export default AIsPage;

AIsPage.getLayout = (page) => {
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
