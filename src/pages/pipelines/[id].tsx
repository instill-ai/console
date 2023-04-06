import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  useActivatePipeline,
  useDeActivatePipeline,
  env,
  useWarnUnsavedChanges,
  ConfigurePipelineForm,
  ChangePipelineStateToggle,
  useSendAmplitudeData,
  useCreateResourceFormStore,
  StateLabel,
  PipelineTable,
  handle,
  getPipelineQuery,
  constructPipelineRecipeWithDefinition,
  useCreateUpdateDeleteResourceGuard,
  type Nullable,
  type Pipeline,
} from "@instill-ai/toolkit";

import { CH } from "@code-hike/mdx/components";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
  PipelineModeLabel,
} from "@/components";

import { getCodeHikeTemplateSource } from "@/lib/markdown/ssr-getCodeHikeTemplateSource";

export const getServerSideProps: GetServerSideProps<PipelinePageProps> = async (
  context
) => {
  const [rawPipelineError, rawPipeline] = await handle(
    getPipelineQuery({
      pipelineName: `pipelines/${context.params?.id}`,
      accessToken: null,
    })
  );

  if (rawPipelineError || !rawPipeline) {
    console.error(
      "Something went wrong when fetch the raw pipeline",
      rawPipelineError
    );
    return {
      notFound: true,
    };
  }

  const [recipeError, recipe] = await handle(
    constructPipelineRecipeWithDefinition({
      rawRecipe: rawPipeline.recipe,
      accessToken: null,
    })
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
  const { id } = router.query;

  const enableGuard = useCreateUpdateDeleteResourceGuard();

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
      <PageHead title={pipeline.name} />
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
            mode={pipeline.mode || "MODE_UNSPECIFIED"}
          />
          <StateLabel
            enableBgColor={true}
            enableIcon={true}
            iconWidth="w-[18px]"
            iconHeight="h-[18px]"
            iconPosition="my-auto"
            state={pipeline.state || "STATE_UNSPECIFIED"}
          />
        </div>
        <PipelineTable pipeline={pipeline} marginBottom="mb-10" />
        <ChangePipelineStateToggle
          pipeline={pipeline}
          switchOn={activatePipeline}
          switchOff={deActivatePipeline}
          marginBottom="mb-10"
          accessToken={null}
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        <ConfigurePipelineForm
          pipeline={pipeline}
          marginBottom="mb-10"
          width={null}
          accessToken={null}
          onDelete={() => {
            router.push("/pipelines");
          }}
          disableDelete={enableGuard}
          onConfigure={null}
          disableConfigure={enableGuard}
        />
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

export default PipelineDetailsPage;
