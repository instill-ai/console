import { FC, ReactElement } from "react";
import {
  SourcesTable,
  useConnectorsWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
} from "@instill-ai/toolkit";
import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { Button, Icons } from "@instill-ai/design-system";
import { useRouter } from "next/router";

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

  const sources = useConnectorsWithPipelines({
    connectorType: "CONNECTOR_TYPE_SOURCE",
    enabled: true,
    accessToken: null,
  });

  const sourcesWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_SOURCE",
    enabled: sources.isSuccess,
    connectorNames: sources.isSuccess
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
            onClick={() => router.push("/sources/create")}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            Add Source
          </Button>
        </div>

        <SourcesTable
          sources={sources.data ? sources.data : []}
          sourcesWatchState={
            sourcesWatchState.isSuccess ? sourcesWatchState.data : {}
          }
          isError={sources.isError || sourcesWatchState.isError}
          isLoading={isLoadingResource}
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
