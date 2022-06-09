import { FC, ReactElement, useEffect } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import { PageTitle, DestinationsTable } from "@/components/ui";
import { useMultiStageQueryLoadingState } from "@/hooks/useMultiStageQueryLoadingState";
import { useDestinationsWithPipelines } from "@/services/connector";
import { useRouter } from "next/router";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";

interface GetLayOutProps {
  page: ReactElement;
}

const DestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const destinations = useDestinationsWithPipelines();

  const isLoading = useMultiStageQueryLoadingState({
    data: destinations.data,
    isError: destinations.isError,
    isLoading: destinations.isLoading,
    isSuccess: destinations.isSuccess,
  });

  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_destinations_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <PageContentContainer>
      <PageTitle
        title="Data Destination"
        breadcrumbs={["Data destination"]}
        enableButton={
          destinations.data
            ? destinations.data.length === 0
              ? false
              : true
            : false
        }
        buttonName="Add new destination"
        buttonLink="/destinations/create"
        marginBottom="mb-10"
      />
      <DestinationsTable
        destinations={destinations.data ? destinations.data : []}
        isLoading={isLoading}
        enablePlaceholderCreateButton={true}
        marginBottom={null}
      />
    </PageContentContainer>
  );
};

export default DestinationPage;

DestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
