import { FC, ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serialize } from "next-mdx-remote/serialize";
import { remarkCodeHike } from "@code-hike/mdx";
import { CH } from "@code-hike/mdx/components";

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
} from "@/components/ui";
import ConfigurePipelineForm from "@/components/forms/pipeline/ConfigurePipelineForm";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";
import PageHead from "@/components/layouts/PageHead";
import ChagneResourceStateSection from "@/components/sections/ChagneResourceStateSection";
import { Pipeline } from "@/lib/instill";
import { GetServerSideProps } from "next";
import fs from "fs";
import { join } from "path";
import { readFile } from "fs/promises";
import { MDXRemoteSerializeResult, MDXRemote } from "next-mdx-remote";
import { Nullable } from "@/types/general";

export const getServerSideProps: GetServerSideProps = async () => {
  const templatePath = join(
    process.cwd(),
    "src",
    "markdown",
    "pipeline-code-snippet.mdx"
  );
  const template = fs.readFileSync(templatePath, { encoding: "utf-8" });

  const theme = JSON.parse(
    await readFile(
      join(process.cwd(), "src", "styles", "rose-pine-moon.json"),
      {
        encoding: "utf-8",
      }
    )
  );

  const templateSource = await serialize(template, {
    parseFrontmatter: false,
    mdxOptions: {
      useDynamicImport: true,
      remarkPlugins: [
        [
          remarkCodeHike,
          {
            theme,
            lineNumbers: false,
            showCopyButton: true,
            autoImport: false,
          },
        ],
      ],
    },
  });

  return {
    props: {
      templateSource,
    },
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

type PipelinePageProps = {
  templateSource: MDXRemoteSerializeResult;
};

const PipelineDetailsPage: FC<PipelinePageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ templateSource }) => {
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

  const [snippet, setSnippet] =
    useState<Nullable<MDXRemoteSerializeResult>>(null);

  useEffect(() => {
    const newSnippet: MDXRemoteSerializeResult = {
      compiledSource: templateSource.compiledSource.replace(
        "{{pipeline-id}}",
        `${id}`
      ),
      scope: templateSource.scope,
      frontmatter: templateSource.frontmatter,
    };

    setSnippet(newSnippet);
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
        <ChagneResourceStateSection
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
        <div>
          {snippet ? (
            <MDXRemote
              compiledSource={snippet.compiledSource}
              scope={snippet.scope}
              frontmatter={snippet.frontmatter}
              components={{ CH }}
            />
          ) : null}
        </div>
      </PageContentContainer>
    </>
  );
};

PipelineDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default PipelineDetailsPage;
