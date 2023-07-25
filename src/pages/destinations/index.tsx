import { FC, ReactElement } from "react";
import {
  useConnectorsWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { DestinationsTable } from "@/components/DestinationsTable";
import { Button, Icons } from "@instill-ai/design-system";
import Router from "next/router";

type GetLayOutProps = {
  page: ReactElement;
};

const DestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const destinations = useConnectorsWithPipelines({
    connectorType: "CONNECTOR_TYPE_DESTINATION",
    enabled: true,
    accessToken: null,
  });

  const destinationsWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_DESTINATION",
    enabled: destinations.isSuccess,
    connectorNames: destinations.isSuccess
      ? destinations.data.map((destination) => destination.name)
      : [],
    accessToken: null,
  });

  const isLoadingResource =
    destinations.isLoading ||
    (destinations.isSuccess && destinations.data.length > 0)
      ? destinationsWatchState.isLoading
      : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="destination-connectors" />
      <div className="flex flex-col">
        <div className="mb-5">
          <Button
            className="gap-x-2"
            variant="primary"
            size="lg"
            onClick={() => Router.push("/destinations/create")}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            Add Destination
          </Button>
        </div>

        <div className="my-5 flex flex-col space-y-2">
          <h4 className="w-full text-semantic-fg-primary product-body-text-1-semibold">
            Destination
          </h4>
          <p className="w-full text-semantic-fg-disabled product-body-text-3-regular">
            Add and organise your Destination
          </p>
        </div>
        <DestinationsTable
          destinations={destinations.data ? destinations.data : []}
          destinationsWatchState={
            destinationsWatchState.isSuccess ? destinationsWatchState.data : {}
          }
          isError={destinations.isError || destinationsWatchState.isError}
          isLoading={isLoadingResource}
        />
      </div>
    </>
  );
};

export default DestinationPage;

DestinationPage.getLayout = (page) => {
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
