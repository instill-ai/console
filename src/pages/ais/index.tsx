import { FC, ReactElement } from "react";
import {
  useConnectorsWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
  AIsTable,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

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
        <PageTitle
          title=""
          breadcrumbs={[""]}
          disabledButton={enableGuard}
          buttonName="Set up new AI"
          buttonLink="/ais/create"
          marginBottom="mb-10"
        />
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
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
