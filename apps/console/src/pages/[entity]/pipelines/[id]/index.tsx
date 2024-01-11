import * as React from "react";
import {
  PageBase,
  ViewPipeline,
  useEntity,
  useUpdatePipelineDescription,
  useUserPipeline,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { ConsoleCorePageHead, Topbar } from "../../../../components";
import { NextPageWithLayout } from "../../../_app";
import { useAccessToken } from "../../../../lib/useAccessToken";
import { useTrackToken } from "../../../../lib/useTrackToken";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
const MDEditor = dynamic(
  () => import("../../../../components").then((mod) => mod.MDEditor),
  { ssr: false }
);

const PipelinePage: NextPageWithLayout = () => {
  const { accessToken, enabledQuery } = useAccessToken();
  useTrackToken({ enabled: true });
  const router = useRouter();

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [markdown, setMarkdown] = React.useState("");

  const entity = useEntity();

  const pipeline = useUserPipeline({
    pipelineName: entity.isSuccess ? entity.pipelineName : null,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    enabled: enabledQuery && entity.isSuccess,
  });

  const ref = React.useRef<MDXEditorMethods>(null);

  React.useEffect(() => {
    if (pipeline.isSuccess) {
      const replaceLineBreakWithBr = pipeline.data.readme.replaceAll(
        /\n(?!\n)/g,
        "<br />"
      );

      ref.current?.setMarkdown(replaceLineBreakWithBr);
    }
  }, [pipeline.isSuccess]);

  useUpdatePipelineDescription({
    value: markdown,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="pipelines" />
      {/* 
        Because we do lots of transition among this page, and nextjs won't
        re-mount the page component, we need to re-render the pipeline view
        when the route changes.
      */}
      <ViewPipeline
        key={router.asPath}
        editor={
          <MDEditor
            editorRef={ref}
            defaultValue={markdown}
            className="h-full"
            onChange={(markdown) => {
              const replaceBrWithLineBreak = markdown.replaceAll(
                /<br \/>/g,
                "\n\n"
              );
              setMarkdown(replaceBrWithLineBreak);
              setHasUnsavedChanges(true);
            }}
          />
        }
        hasUnsavedChanges={hasUnsavedChanges}
      />
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
