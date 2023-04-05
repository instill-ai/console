import { FC, ReactElement, useState } from "react";
import { useRouter } from "next/router";

import {
  PipelinesTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { usePipelines } from "@/services/pipeline";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import {
  useCreateUpdateDeleteResourceGuard,
  useSendAmplitudeData,
} from "@/hooks";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const pipelines = usePipelines(true);
  const { amplitudeIsInit } = useAmplitudeCtx();
  useSendAmplitudeData(
    "hit_pipelines_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  return (
    <>
      <PageHead title="pipelines" />
      <PageContentContainer>
        <PageTitle
          title="Pipeline"
          breadcrumbs={["Pipeline"]}
          enableButton={true}
          buttonName="Add new pipeline"
          buttonLink="/pipelines/create"
          marginBottom="mb-10"
        />
        <PipelinesTable
          pipelines={pipelines.isSuccess ? pipelines.data : null}
          marginBottom={null}
        />
      </PageContentContainer>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelinePage;
