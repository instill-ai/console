import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import {
  useSendAmplitudeData,
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
  const router = useRouter();

  const models = useModels({
    accessToken: null,
    enable: true,
  });

  const modelsWatchState = useWatchModels({
    modelNames: models.isSuccess ? models.data.map((p) => p.name) : [],
    accessToken: null,
    enable: models.isSuccess,
  });

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  useSendAmplitudeData(
    "hit_models_page",
    { type: "navigation" },
    router.isReady
  );

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
            modelsWatchState.isSuccess ? modelsWatchState.data : null
          }
          isError={models.isError || modelsWatchState.isError}
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
