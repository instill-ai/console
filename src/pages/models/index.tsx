import { FC, ReactElement } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import ModelTable from "@/services/model/ModelTable";

interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const models = [];
  return (
    <PageContentContainer>
      <PageTitle
        title="Model"
        breadcrumbs={["Model"]}
        enableButton={models.length === 0 ? false : true}
        buttonName="Add new model"
        buttonLink="/models/create"
        marginBottom="mb-10"
      />
      <ModelTable models={[]} isLoading={false} />
    </PageContentContainer>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
