import { FC, ReactElement } from "react";
import {
  useConnectorsWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { SourcesTable } from "@/components/SourcesTable";

type GetLayOutProps = {
  page: ReactElement;
};

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const enableGuard = useCreateUpdateDeleteResourceGuard();

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const sources = useConnectorsWithPipelines({
    connectorType: "CONNECTOR_TYPE_OPERATOR",
    enabled: true,
    accessToken: null,
  });

  const sourcesWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_OPERATOR",
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
        <PageTitle
          title="Operator"
          breadcrumbs={["Operator"]}
          disabledButton={enableGuard}
          buttonName="Set up new operator"
          buttonLink="/operators/create"
          marginBottom="mb-10"
        />
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
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
