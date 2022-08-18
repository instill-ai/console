import { FC, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import Prism from "prismjs";

import { PageBase, PageContentContainer } from "@/components/layouts";
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
  CodeBlock,
} from "@/components/ui";
import ConfigurePipelineForm from "@/components/forms/pipeline/ConfigurePipelineForm";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";
import PageHead from "@/components/layouts/PageHead";
import { Pipeline } from "@/lib/instill";
import { GetServerSideProps } from "next";
import { join } from "path";
import fs from "fs";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const snippetSource = await getTemplateCodeBlockMdx(
  //   "pipeline-code-template.mdx",
  //   "instill-pipeline-id",
  //   `${context.params?.id}`
  // );

  const templatePath = join(
    process.cwd(),
    "src",
    "lib",
    "markdown",
    "template",
    "pipeline-snippet-simple.mdx"
  );

  const template = fs.readFileSync(templatePath, { encoding: "utf-8" });
  const codeStr = template.replaceAll(
    "instill-pipeline-id",
    `${context.params?.id}`
  );

  const snippet = `curl -X POST http://localhost:8081/v1alpha/pipelines/${context.params?.id}:trigger -d '{
    "inputs": [
      {
        "image_url": "https://artifacts.instill.tech/imgs/dog.jpg"
      },
      {
        "image_url": "https://artifacts.instill.tech/imgs/polar-bear.jpg"
      }
    ]
  }'`;

  return {
    props: {
      snippetSource: codeStr,
      snippetCode: snippet,
    },
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

type PipelinePageProps = {
  snippetSource: string;
  snippetCode: string;
};

const PipelineDetailsPage: FC<PipelinePageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ snippetSource, snippetCode }) => {
  const router = useRouter();
  const { id } = router.query;

  const pipeline = usePipeline(id ? `pipelines/${id.toString()}` : null);

  const deActivatePipeline = useDeActivatePipeline();
  const activatePipeline = useActivatePipeline();

  // ###################################################################
  // #                                                                 #
  // # Setup code block                                                #
  // #                                                                 #
  // ###################################################################

  // const [snippet, setSnippet] =
  //   useState<Nullable<MDXRemoteSerializeResult>>(null);

  // useEffect(() => {
  //   setSnippet({
  //     compiledSource: snippetSource.compiledSource.replaceAll(
  //       "instill-pipeline-id",
  //       `${id}`
  //     ),
  //     scope: snippetSource.scope,
  //     frontmatter: snippetSource.frontmatter,
  //   });
  // }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

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
        <h3 className="mb-5 text-black text-instill-h3">Settings</h3>
        <ConfigurePipelineForm
          pipeline={pipeline.isSuccess ? pipeline.data : null}
          marginBottom={null}
        />
        <div className="mb-5 flex flex-col">
          <h3 className="mb-5 text-black text-instill-h3">Trigger</h3>
          <p className="text-black text-instill-body">
            You can now trigger the pipeline via sending REST requests.
          </p>
        </div>
        <CodeBlock source={snippetSource} code={snippetCode} />
      </PageContentContainer>
    </>
  );
};

PipelineDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelineDetailsPage;
