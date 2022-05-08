import { FC, ReactElement } from "react";

import { CreateSourceForm } from "@/components/forms";
import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";

interface GetLayOutProps {
  page: ReactElement;
}

const CreateSourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <PageContentContainer>
      <PageTitle
        title="Set up new source"
        breadcrumbs={["Data source", "Source Settings"]}
        enableButton={false}
        marginBottom="mb-10"
      />
      <CreateSourceForm />
    </PageContentContainer>
  );
};

CreateSourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateSourcePage;
