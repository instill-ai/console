import { FC, ReactElement } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import DestinationTable from "@/services/connector/DestinationTable";

interface GetLayOutProps {
  page: ReactElement;
}

const DestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const destination = [];
  return (
    <PageContentContainer>
      <PageTitle
        title="Data Destination"
        breadcrumbs={["Data destination"]}
        enableButton={destination.length === 0 ? false : true}
        buttonName="Add new destination"
        buttonLink="/destinations/create"
        marginBottom="mb-10"
      />
      <DestinationTable destinations={[]} isLoading={false} />
    </PageContentContainer>
  );
};

export default DestinationPage;

DestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
