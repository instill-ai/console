import { FC, ReactElement } from "react";

import {
  ModelsTable,
  useModels,
  useCreateUpdateDeleteResourceGuard,
  useWatchModels,
} from "@instill-ai/toolkit";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

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
      <div className="flex flex-col">
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
      </div>
    </>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
