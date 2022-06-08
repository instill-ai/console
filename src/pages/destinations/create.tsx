import { FC, ReactElement } from "react";

import { CreateDestinationForm } from "@/components/forms";
import { PageBase, PageContentContainer } from "@/components/layouts";
import { PageTitle } from "@/components/ui";

interface GetLayOutProps {
  page: ReactElement;
}

const CreateDestinationPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <PageContentContainer>
      <PageTitle
        title="Set Up New Destination"
        breadcrumbs={["Data Destination", "Destination Settings"]}
        enableButton={false}
        marginBottom="mb-10"
      />
      <CreateDestinationForm />
    </PageContentContainer>
  );
};

CreateDestinationPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateDestinationPage;
