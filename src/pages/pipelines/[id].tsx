import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { CH } from "@code-hike/mdx/components";

import {
  useActivatePipeline,
  useDeActivatePipeline,
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
import { getPipelineQuery, Pipeline } from "@/lib/instill";
import { getCodeHikeTemplateSource } from "@/lib/markdown";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { env, handle } from "@/utils";
import { constructPipelineRecipeWithDefinition } from "@/services/helper";
import { Nullable } from "@/types/general";

// This page didn't utilize react-query client side cache due to we already
// need the codeMdxSource on server side. We will refactor this whole page
// with Nextjs native app folder and router cache in the next iteration.

export const getServerSideProps: GetServerSideProps<PipelinePageProps> = async (
  context
) => {
  const [rawPipelineError, rawPipeline] = await handle(
    getPipelineQuery(`pipelines/${context.params?.id}`)
  );

  if (rawPipelineError || !rawPipeline) {
    console.error("Something went wrong when fetch the raw pipeline");
    return {
      notFound: true,
    };
  }

  const [recipeError, recipe] = await handle(
    constructPipelineRecipeWithDefinition(rawPipeline.recipe)
  );

  if (recipeError || !recipe) {
    console.error("Something went wrong when fetch the pipeline's recipe");
    return {
      notFound: true,
    };
  }

  const pipeline: Pipeline = {
    ...rawPipeline,
    recipe: recipe,
  };

  let templateName: Nullable<string> = null;

  switch (pipeline.recipe.models[0].task) {
    case "TASK_CLASSIFICATION": {
      templateName = "pipeline-image-classification.mdx";
      break;
    }
    case "TASK_DETECTION": {
      templateName = "pipeline-object-detection.mdx";
      break;
    }
    case "TASK_INSTANCE_SEGMENTATION": {
      templateName = "pipeline-instance-segmentation.mdx";
      break;
    }
    case "TASK_KEYPOINT": {
      templateName = "pipeline-keypoint-detection.mdx";
      break;
    }
    case "TASK_OCR": {
      templateName = "pipeline-ocr.mdx";
      break;
    }
    case "TASK_SEMANTIC_SEGMENTATION": {
      templateName = "pipeline-semantic-segmentation.mdx";
      break;
    }
    case "TASK_TEXT_TO_IMAGE": {
      templateName = "pipeline-text-to-image.mdx";
      break;
    }
    case "TASK_TEXT_GENERATION": {
      templateName = "pipeline-text-generation.mdx";
      break;
    }
    case "TASK_UNSPECIFIED": {
      templateName = "pipeline-unspecified.mdx";
      break;
    }
  }

  if (!templateName) {
    console.error("Something went wrong when match correct task template");
    return {
      notFound: true,
    };
  }

  const codeMdxSource = await getCodeHikeTemplateSource({
    templateName,
    replaceRules: [
      {
        match: "serverApiBaseUrlPlaceholder",
        replaceValue: env("NEXT_PUBLIC_API_GATEWAY_BASE_URL") ?? "",
      },
      {
        match: "pipelineIdPlaceholder",
        replaceValue: context.params?.id?.toString() ?? "",
      },
    ],
    showCopyButton: true,
  });

  return {
    props: {
      codeMdxSource,
      pipeline,
    },
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

type PipelinePageProps = {
  codeMdxSource: MDXRemoteSerializeResult;
  pipeline: Pipeline;
};

const PipelineDetailsPage: FC<PipelinePageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ codeMdxSource, pipeline }) => {
  const router = useRouter();
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
      <PageHead title={pipeline ? (pipeline.name as string) : ""} />
      <PageContentContainer>
        <PageTitle
          title={pipeline.id}
          breadcrumbs={["Pipeline", pipeline.id]}
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
            mode={pipeline.mode || "MODE_UNSPECIFIED"}
          />
          <StateLabel
            enableBgColor={true}
            enableIcon={true}
            iconWidth="w-[18px]"
            iconHeight="h-[18px]"
            iconPosition="my-auto"
            paddingX="px-[5px]"
            paddingY="py-1.5"
            state={pipeline.state || "STATE_UNSPECIFIED"}
          />
        </div>
        <PipelineTable
          pipeline={pipeline || null}
          isLoading={false}
          marginBottom="mb-10"
        />
        <ChangeResourceStateButton
          resource={pipeline || null}
          switchOn={activatePipeline}
          switchOff={deActivatePipeline}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        {pipeline ? (
          <ConfigurePipelineForm pipeline={pipeline} marginBottom="mb-10" />
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
