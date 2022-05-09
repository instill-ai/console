import { FC, ReactElement } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { CreateModelForm } from "@/components/forms";

interface GetLayOutProps {
  page: ReactElement;
}

const CreateModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <PageContentContainer>
      <PageTitle
        title="Set Up New Model"
        breadcrumbs={["Model", "Settings"]}
        enableButton={false}
        marginBottom="mb-10"
      />
      <CreateModelForm />
    </PageContentContainer>
  );
};

CreateModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreateModelPage;
