import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui/";

import {
  useSendAmplitudeData,
  ModelsTable,
  useModels,
} from "@instill-ai/toolkit";

interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const models = useModels({
    accessToken: null,
    enable: true,
  });

  const router = useRouter();

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
          enableButton={true}
          buttonName="Add new model"
          buttonLink="/models/create"
          marginBottom="mb-10"
        />
        <ModelsTable
          models={models.isSuccess ? models.data : []}
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
