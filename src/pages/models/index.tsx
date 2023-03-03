import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import {
  ModelsTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui/";
import { useModelsWithInstances } from "@/services/model";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks";

interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const modelsWithInstances = useModelsWithInstances();
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
          title={null}
          breadcrumbs={[]}
          displayButton={true}
          buttonName="Add new model"
          buttonLink="/models/create"
          marginBottom="mb-10"
        />
        <ModelsTable
          models={
            modelsWithInstances.isSuccess ? modelsWithInstances.data : null
          }
          marginBottom={null}
        />
      </PageContentContainer>
    </>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
