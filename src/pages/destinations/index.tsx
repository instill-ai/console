import { FC, ReactElement, useMemo, useState } from "react";
import { useRouter } from "next/router";

import {
  PageTitle,
  DestinationsTable,
  PageBase,
  PageContentContainer,
  PageHead,
  TableLoadingProgress,
} from "@/components/ui";
import { useDestinationsWithPipelines } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData, useStateOverviewCounts } from "@/hooks";
import { PaginationListContainer } from "@/components/ui/PaginationListContainer";
import { Nullable } from "@/types/general";
import { useResourcePages } from "@/hooks/useResourcePages";

type GetLayOutProps = {
  page: ReactElement;
};

const DestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const destinations = useDestinationsWithPipelines();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState<Nullable<string>>(null);

  const pageSize = 10;

  const destinationPages = useResourcePages({
    resources: destinations.data || null,
    searchTerm,
    pageSize,
  });

  const stateOverviewCounts = useStateOverviewCounts(
    destinations.isSuccess ? destinations.data : []
  );

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
          title=""
          breadcrumbs={[]}
          enableButton={
            destinations.data
              ? destinations.data.length === 0
                ? false
                : true
              : false
          }
          buttonName="Set up new destination"
          buttonLink="/destinations/create"
          marginBottom="mb-10"
        />
        <PaginationListContainer
          title="Destination"
          description="These are the destinations you can select"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalPage={destinationPages.length}
        >
          {destinations.isSuccess ? (
            <DestinationsTable
              marginBottom={null}
              currentPage={currentPage}
              destinationPages={destinationPages}
              stateOverviewCounts={stateOverviewCounts}
            />
          ) : (
            <TableLoadingProgress marginBottom={null} />
          )}
        </PaginationListContainer>
      </PageContentContainer>
    </>
  );
};

export default DestinationPage;

DestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
