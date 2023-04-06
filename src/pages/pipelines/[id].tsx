import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  useActivatePipeline,
  useDeActivatePipeline,
  usePipeline,
  env,
  useWarnUnsavedChanges,
  ConfigurePipelineForm,
  ChangePipelineStateToggle,
  useSendAmplitudeData,
  useCreateResourceFormStore,
  StateLabel,
  PipelineTable,
  type Pipeline,
} from "@instill-ai/toolkit";

import { CH } from "@code-hike/mdx/components";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
  PipelineModeLabel,
} from "@/components/ui";

import { getCodeHikeTemplateSource } from "@/lib/markdown/ssr-getCodeHikeTemplateSource";

export const getServerSideProps: GetServerSideProps<PipelinePageProps> = async (
  context
) => {
  const codeMdxSource = await getCodeHikeTemplateSource({
    templateName: "pipeline-code-template.mdx",
    replaceRules: [
      {
        match: "instillServerHostName",
        replaceValue: env("NEXT_PUBLIC_API_GATEWAY_BASE_URL") ?? "",
      },
      {
        match: "instillPipelineId",
        replaceValue: context.params?.id?.toString() ?? "",
      },
    ],
    showCopyButton: true,
  });

  return {
    props: {
      codeMdxSource,
    },
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

type PipelinePageProps = {
  codeMdxSource: MDXRemoteSerializeResult;
};

const PipelineDetailsPage: FC<PipelinePageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ codeMdxSource }) => {
  const router = useRouter();
  const { id } = router.query;
  const pipeline = usePipeline({
    pipelineName: id ? `pipelines/${id.toString()}` : null,
    accessToken: null,
    enable: true,
  });
  const deActivatePipeline = useDeActivatePipeline();
  const activatePipeline = useActivatePipeline();
  const formIsDirty = useCreateResourceFormStore((state) => state.formIsDirty);

  useWarnUnsavedChanges({
    router,
    haveUnsavedChanges: formIsDirty,
    confirmation:
      "You have unsaved changes, are you sure you want to leave this page?",
    callbackWhenLeave: null,
  });

  useSendAmplitudeData(
    "hit_pipeline_page",
    { type: "navigation" },
    router.isReady
  );

  return (
    <>
      <PageHead
        title={pipeline.isLoading ? "" : (pipeline.data?.name as string)}
      />
      <PageContentContainer>
        <PageTitle
          title={id ? id.toString() : ""}
          breadcrumbs={id ? ["Pipeline", id.toString()] : ["Pipeline"]}
          enableButton={false}
          marginBottom="mb-5"
        />
        <div className="mb-10 flex flex-row gap-x-2.5">
          <PipelineModeLabel
            enableBgColor={true}
            enableIcon={true}
            iconWidth="w-[18px]"
            iconHeight="h-[18px]"
            iconPosition="my-auto"
            paddingX="px-[5px]"
            paddingY="py-1.5"
            mode={pipeline.data?.mode || "MODE_UNSPECIFIED"}
          />
          <StateLabel
            enableBgColor={true}
            enableIcon={true}
            iconWidth="w-[18px]"
            iconHeight="h-[18px]"
            iconPosition="my-auto"
            state={pipeline.data?.state || "STATE_UNSPECIFIED"}
          />
        </div>
        <PipelineTable
          pipeline={pipeline.isSuccess ? pipeline.data || null : null}
          marginBottom="mb-10"
        />
        <ChangePipelineStateToggle
          pipeline={pipeline.isLoading ? null : (pipeline.data as Pipeline)}
          switchOn={activatePipeline}
          switchOff={deActivatePipeline}
          marginBottom="mb-10"
          accessToken={null}
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        {pipeline.isSuccess && pipeline.data ? (
          <ConfigurePipelineForm
            pipeline={pipeline.data}
            marginBottom="mb-10"
            width={null}
            accessToken={null}
            onDelete={() => {
              router.push("/pipelines");
            }}
            onConfigure={null}
          />
        ) : null}
        <div className="mb-5 flex flex-col">
          <h3 className="mb-5 text-black text-instill-h3">Trigger</h3>
          <p className="text-black text-instill-body">
            You can now trigger the pipeline via sending REST requests.
          </p>
        </div>
        <div>
          <MDXRemote {...codeMdxSource} components={{ CH }} />
        </div>
      </PageContentContainer>
    </>
  );
};

PipelineDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

// We need this line to make our code-hike snippet work under Next.js standalone server
// https://github.com/code-hike/codehike/issues/283
export const config = {
  unstable_includeFiles: ["node_modules/.pnpm/**/shiki/**/*.json"],
};

export default PipelineDetailsPage;
