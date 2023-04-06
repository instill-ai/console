import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useSendAmplitudeData,
  useSourcesWithPipelines,
  SourcesTable,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();

  const sources = useSourcesWithPipelines({
    accessToken: null,
    enable: true,
  });

  useSendAmplitudeData(
    "hit_sources_page",
    { type: "navigation" },
    router.isReady
  );

  return (
    <>
      <PageHead title="source-connectors" />
      <PageContentContainer>
        <PageTitle
          title="Source"
          breadcrumbs={["Source"]}
          enableButton={true}
          buttonName="Set up new source"
          buttonLink="/sources/create"
          marginBottom="mb-10"
        />
        <SourcesTable
          sources={sources.data ? sources.data : []}
          marginBottom={null}
        />
      </PageContentContainer>
    </>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
