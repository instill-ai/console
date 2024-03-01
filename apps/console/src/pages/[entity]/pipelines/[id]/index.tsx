import * as React from "react";
import { PageBase, ViewPipeline, Topbar } from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { ConsoleCorePageHead } from "../../../../components";
import { NextPageWithLayout } from "../../../_app";
import { useAccessToken } from "../../../../lib/useAccessToken";
import { useTrackToken } from "../../../../lib/useTrackToken";
import { useRouter } from "next/router";

const PipelinePage: NextPageWithLayout = () => {
  useAccessToken();
  useTrackToken({ enabled: true });
  const router = useRouter();

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="pipelines" />
      {/* 
        Because we do lots of transition among this page, and nextjs won't
        re-mount the page component, we need to re-render the pipeline view
        when the route changes.
      */}
      <ViewPipeline key={router.asPath} />
    </React.Fragment>
  );
};

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-0">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
