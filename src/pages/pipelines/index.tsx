import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  usePipelines,
  useSendAmplitudeData,
  PipelinesTable,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const pipelines = usePipelines({
    accessToken: null,
    enable: true,
  });

  useSendAmplitudeData(
    "hit_pipelines_page",
    { type: "navigation" },
    router.isReady
  );

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
          pipelines={pipelines.data ? pipelines.data : []}
          marginBottom="mb-5"
        />
      </PageContentContainer>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelinePage;
