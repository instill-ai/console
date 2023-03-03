import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import {
  SourcesTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { useSourcesWithPipelines } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks";

type GetLayOutProps = {
  page: ReactElement;
};

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const sources = useSourcesWithPipelines();
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();
  useSendAmplitudeData(
    "hit_sources_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="source-connectors" />
      <PageContentContainer>
        <PageTitle
          title={null}
          breadcrumbs={[]}
          displayButton={true}
          buttonName="Set up new source"
          buttonLink="/sources/create"
          marginBottom="mb-10"
        />
        <SourcesTable
          sources={sources.isSuccess ? sources.data : null}
          marginBottom={null}
        />
      </PageContentContainer>
    </>
  );
};

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default SourcePage;
