import { FC, ReactElement } from "react";
import {
  useDestinationsWithPipelines,
  DestinationsTable,
  useCreateUpdateDeleteResourceGuard,
  useWatchDestinations,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

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

  const destinations = useDestinationsWithPipelines({
    enabled: true,
    accessToken: null,
  });

  const destinationsWatchState = useWatchDestinations({
    enabled: destinations.isSuccess,
    destinationNames: destinations.isSuccess
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
        <PageTitle
          title="Destination"
          breadcrumbs={["Destination"]}
          enableButton={enableGuard ? false : true}
          buttonName="Set up new destination"
          buttonLink="/destinations/create"
          marginBottom="mb-10"
        />
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
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
