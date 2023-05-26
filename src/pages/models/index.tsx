import { FC, ReactElement } from "react";

import {
  ModelsTable,
  useModels,
  useCreateUpdateDeleteResourceGuard,
  useWatchModels,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components";

interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const models = useModels({
    enabled: true,
    accessToken: null,
  });

  const modelsWatchState = useWatchModels({
    enabled: models.isSuccess,
    modelNames: models.isSuccess ? models.data.map((p) => p.name) : [],
    accessToken: null,
  });

  const isLoadingResource =
    models.isLoading || (models.isSuccess && models.data.length > 0)
      ? modelsWatchState.isLoading
      : false;

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="models" />
      <PageContentContainer>
        <PageTitle
          title="Model"
          breadcrumbs={["Model"]}
          enableButton={enableGuard ? false : true}
          buttonName="Add new model"
          buttonLink="/models/create"
          marginBottom="mb-10"
        />
        <ModelsTable
          models={models.isSuccess ? models.data : []}
          modelsWatchState={
            modelsWatchState.isSuccess ? modelsWatchState.data : {}
          }
          isError={models.isError || modelsWatchState.isError}
          isLoading={isLoadingResource}
          marginBottom="mb-5"
        />
      </PageContentContainer>
    </>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
