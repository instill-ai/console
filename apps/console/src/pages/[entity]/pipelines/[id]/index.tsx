import * as React from "react";
import {
  PageBase,
  ViewPipeline,
  Topbar,
  MDXEditorMethods,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

const Editor = dynamic(
  () => import("@instill-ai/toolkit").then((mod) => mod.InitializedMDXEditor),
  {
    // Make sure we turn SSR off
    ssr: false,
  }
);

import { ConsoleCorePageHead } from "../../../../components";
import { NextPageWithLayout } from "../../../_app";
import { useAccessToken } from "../../../../lib/useAccessToken";
import { useTrackToken } from "../../../../lib/useTrackToken";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const PipelinePage: NextPageWithLayout = () => {
  useAccessToken();
  useTrackToken({ enabled: true });
  const router = useRouter();
  const ref = React.useRef<MDXEditorMethods>(null);

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="pipelines" />
      {/* 
        Because we do lots of transition among this page, and nextjs won't
        re-mount the page component, we need to re-render the pipeline view
        when the route changes.
      */}
      <ViewPipeline key={router.asPath} />
      <Editor editorRef={ref} markdown="hello world" />
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
