import { FC, ReactElement } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import ModelTable from "@/services/model/ModelTable";
import { useModelsWithInstances } from "@/services/model/ModelServices";

interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const modelsWithInstances = useModelsWithInstances();
  return (
    <PageContentContainer>
      <PageTitle
        title="Model"
        breadcrumbs={["Model"]}
        enableButton={
          modelsWithInstances.isSuccess
            ? modelsWithInstances.data.length === 0
              ? false
              : true
            : false
        }
        buttonName="Add new model"
        buttonLink="/models/create"
        marginBottom="mb-10"
      />
      <ModelTable
        models={modelsWithInstances.isSuccess ? modelsWithInstances.data : []}
        isLoading={modelsWithInstances.isLoading}
      />
    </PageContentContainer>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
