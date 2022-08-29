import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import { PageBase, PageContentContainer } from "@/components/layouts";
import { ModelsTable, PageTitle } from "@/components/ui/";
import { useModelsWithInstances } from "@/services/model";
import { useMultiStageQueryLoadingState } from "@/hooks/useMultiStageQueryLoadingState";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";
import PageHead from "@/components/layouts/PageHead";

interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const modelsWithInstances = useModelsWithInstances();

  const isLoading = useMultiStageQueryLoadingState({
    data: modelsWithInstances.data,
    isError: modelsWithInstances.isError,
    isSuccess: modelsWithInstances.isSuccess,
    isLoading: modelsWithInstances.isLoading,
  });

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_models_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="models" />
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
        <ModelsTable
          models={modelsWithInstances.isSuccess ? modelsWithInstances.data : []}
          isLoading={isLoading}
          marginBottom={null}
          enablePlaceholderCreateButton={true}
        />
      </PageContentContainer>
    </>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
