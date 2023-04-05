import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import {
  PageTitle,
  DestinationsTable,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { useDestinationsWithPipelines } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks";

type GetLayOutProps = {
  page: ReactElement;
};

const DestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const destinations = useDestinationsWithPipelines();

  const { amplitudeIsInit } = useAmplitudeCtx();
  useSendAmplitudeData(
    "hit_destinations_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
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
          destinations={destinations.isSuccess ? destinations.data : null}
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
