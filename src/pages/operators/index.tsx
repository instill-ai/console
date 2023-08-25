import { FC, ReactElement } from "react";
import {
  SourcesTable,
  useConnectorResourcesWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectorResources,
} from "@instill-ai/toolkit";
import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { useRouter } from "next/router";
import { Button, Icons } from "@instill-ai/design-system";

type GetLayOutProps = {
  page: ReactElement;
};

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const sources = useConnectorResourcesWithPipelines({
    connectorResourceType: "CONNECTOR_TYPE_OPERATOR",
    enabled: true,
    accessToken: null,
  });

  const sourcesWatchState = useWatchConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_OPERATOR",
    enabled: sources.isSuccess,
    connectorResourceNames: sources.isSuccess
      ? sources.data.map((source) => source.name)
      : [],
    accessToken: null,
  });

  const isLoadingResource =
    sources.isLoading || (sources.isSuccess && sources.data.length > 0)
      ? sourcesWatchState.isLoading
      : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="source-connectors" />
      <div className="flex flex-col">
        <div className="mb-14">
          <Button
            className="gap-x-2"
            variant="primary"
            size="lg"
            onClick={() => {
              if (!enableGuard) router.push("/operators/create");
            }}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            Add Operator
          </Button>
        </div>

        <SourcesTable
          sources={sources.data ? sources.data : []}
          isError={sources.isError || sourcesWatchState.isError}
          isLoading={isLoadingResource}
          accessToken={null}
        />
      </div>
    </>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
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
