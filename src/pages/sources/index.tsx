import { FC, ReactElement, useEffect } from "react";
import {
  useConnectorsWithPipelines,
  SourcesTable,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
  Nullable,
  createInstillAxiosClient,
  Connector,
  getQueryString,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

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
    connectorType: "CONNECTOR_TYPE_SOURCE",
    enabled: true,
    accessToken: null,
  });

  console.log(
    sources.data,
    sources.isSuccess,
    sources.isSuccess ? sources.data.map((source) => source.name) : []
  );

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

  // useEffect(() => {
  //   listConnectorsQuery({
  //     pageSize: 10,
  //     nextPageToken: null,
  //     accessToken: null,
  //     filter: null,
  //   }).then((res) => {
  //     console.log(res);
  //   });
  // }, []);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="source-connectors" />
      <div className="flex flex-col">
        <PageTitle
          title="Source"
          breadcrumbs={["Source"]}
          enableButton={enableGuard ? false : true}
          buttonName="Set up new source"
          buttonLink="/sources/create"
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

export type ListConnectorsResponse = {
  connectors: Connector[];
  next_page_token: string;
  total_size: string;
};

export async function listConnectorsQuery({
  pageSize,
  nextPageToken,
  accessToken,
  filter,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const connectors: Connector[] = [];

    const queryString = getQueryString(
      `/connectors?view=VIEW_BASIC`,
      pageSize,
      nextPageToken,
      filter
    );

    const { data } = await client.get<ListConnectorsResponse>(queryString);

    connectors.push(...data.connectors);

    if (data.next_page_token) {
      connectors.push(
        ...(await listConnectorsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
          filter,
        }))
      );
    }

    return Promise.resolve(connectors);
  } catch (err) {
    return Promise.reject(err);
  }
}
