import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useSendAmplitudeData,
  useDestinationsWithPipelines,
  DestinationsTable,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const DestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const destinations = useDestinationsWithPipelines({
    accessToken: null,
    enable: true,
  });

  const router = useRouter();

  useSendAmplitudeData(
    "hit_destinations_page",
    { type: "navigation" },
    router.isReady
  );

  return (
    <>
      <PageHead title="destination-connectors" />
      <PageContentContainer>
        <PageTitle
          title="Destination"
          breadcrumbs={["Destination"]}
          enableButton={true}
          buttonName="Set up new destination"
          buttonLink="/destinations/create"
          marginBottom="mb-10"
        />
        <DestinationsTable
          destinations={destinations.data ? destinations.data : []}
          marginBottom={null}
        />
      </PageContentContainer>
    </>
  );
};

export default DestinationPage;

DestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
