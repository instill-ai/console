import { FC, ReactElement, useEffect, useState } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import DestinationTable from "@/services/connector/DestinationTable";
import {
  useDestinations,
  useDestinationsWithPipelines,
  useDestinationWithPipelines,
} from "@/services/connector/DestinationServices";
import { useMultiStageQueryLoadingState } from "@/services/useMultiStageQueryLoadingState";

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
      <DestinationTable
        destinations={destinations.data ? destinations.data : []}
        isLoading={isLoading}
      />
    </PageContentContainer>
  );
};

export default DestinationPage;

DestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
