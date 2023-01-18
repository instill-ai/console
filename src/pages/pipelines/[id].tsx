import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { CH } from "@code-hike/mdx/components";

import {
  useActivatePipeline,
  useDeActivatePipeline,
  usePipeline,
} from "@/services/pipeline";
import {
  PipelineTable,
  StateLabel,
  PipelineModeLabel,
  PageTitle,
  ChangeResourceStateButton,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components/ui";
import { ConfigurePipelineForm } from "@/components/pipeline";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks";
import { Pipeline } from "@/lib/instill";
import { getCodeHikeTemplateSource } from "@/lib/markdown";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { env } from "@/utils";

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
  const pipeline = usePipeline(id ? `pipelines/${id.toString()}` : null);
  const deActivatePipeline = useDeActivatePipeline();
  const activatePipeline = useActivatePipeline();

  // #########################################################################
  // # Send page loaded data to Amplitude                                    #
  // #########################################################################

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_pipeline_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
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
            paddingX="px-[5px]"
            paddingY="py-1.5"
            state={pipeline.data?.state || "STATE_UNSPECIFIED"}
          />
        </div>
        <PipelineTable
          pipeline={pipeline.isSuccess ? pipeline.data : null}
          isLoading={false}
          marginBottom="mb-10"
        />
        <ChangeResourceStateButton
          resource={pipeline.isLoading ? null : (pipeline.data as Pipeline)}
          switchOn={activatePipeline}
          switchOff={deActivatePipeline}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        {pipeline.isSuccess && pipeline.data ? (
          <ConfigurePipelineForm
            pipeline={pipeline.data}
            marginBottom="mb-10"
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
