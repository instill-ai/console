import { FC, ReactElement } from "react";
import {
  AIsTable,
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

const AIsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const ais = useConnectorResourcesWithPipelines({
    connectorResourceType: "CONNECTOR_TYPE_AI",
    enabled: true,
    accessToken: null,
  });

  const aisWatchState = useWatchConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_AI",
    enabled: ais.isSuccess,
    connectorResourceNames: ais.isSuccess ? ais.data.map((ai) => ai.name) : [],
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
        <div className="mb-14">
          <Button
            className="gap-x-2"
            variant="primary"
            size="lg"
            onClick={() => {
              if (!enableGuard) router.push("/ais/create");
            }}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            Add AI Connector
          </Button>
        </div>

        <AIsTable
          ais={ais.data ? ais.data : []}
          aisWatchState={aisWatchState.isSuccess ? aisWatchState.data : {}}
          isError={ais.isError || aisWatchState.isError}
          isLoading={isLoadingResource}
          accessToken={null}
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
