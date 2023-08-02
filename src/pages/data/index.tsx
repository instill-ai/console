import { FC, ReactElement } from "react";
import {
  useConnectorsWithPipelines,
  useCreateUpdateDeleteResourceGuard,
  useWatchConnectors,
} from "@instill-ai/toolkit";
import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { DestinationsTable } from "@/components/DestinationsTable";
import { useRouter } from "next/router";
import { Button, Icons } from "@instill-ai/design-system";

type GetLayOutProps = {
  page: ReactElement;
};

const DestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const destinations = useConnectorsWithPipelines({
    connectorType: "CONNECTOR_TYPE_DATA",
    enabled: true,
    accessToken: null,
  });

  const destinationsWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_DATA",
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
        <div className="mb-14">
          <Button
            className="gap-x-2"
            variant="primary"
            size="lg"
            onClick={() => router.push("/data/create")}
          >
            <Icons.Plus className="h-5 w-5 stroke-semantic-bg-primary" />
            Add Data
          </Button>
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
