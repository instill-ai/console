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
  useCreateResourceFormStore,
  StateLabel,
  PipelineTable,
  handle,
  getPipelineQuery,
  useCreateUpdateDeleteResourceGuard,
  getComponentFromPipelineRecipe,
  useWatchPipeline,
  type Nullable,
  type Pipeline,
} from "@instill-ai/toolkit";

import { CH } from "@code-hike/mdx/components";

import {
  PageTitle,
  PageHead,
  PipelineModeLabel,
  Topbar,
  Sidebar,
  PageBase,
} from "@/components";

import { getCodeHikeTemplateSource } from "@/lib/markdown/ssr-getCodeHikeTemplateSource";

export const getServerSideProps: GetServerSideProps<PipelinePageProps> = async (
  context
) => {
  const [pipelineError, pipeline] = await handle(
    getPipelineQuery({
      pipelineName: `pipelines/${context.params?.id}`,
      accessToken: null,
    })
  );

  if (pipelineError || !pipeline) {
    console.error(
      "Something went wrong when fetch the raw pipeline",
      pipelineError
    );
    return {
      notFound: true,
    };
  }

  let templateName: Nullable<string> = null;

  const model = getComponentFromPipelineRecipe({
    recipe: pipeline.recipe,
    componentName: "model",
  });

  const modelTask = model ? model[0].resource_detail.task : null;

  switch (modelTask) {
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
        replaceValue: env("NEXT_PUBLIC_VDP_API_GATEWAY_BASE_URL") ?? "",
      },
      {
        match: "pipelineIdPlaceholder",
        replaceValue: context.params?.id?.toString() ?? "",
      },
      {
        match: "triggerEndpoint",
        replaceValue:
          pipeline.mode === "MODE_SYNC" ? "triggerSync" : "triggerAsync",
      },
      {
        match: "triggerMultipartEndpoint",
        replaceValue:
          pipeline.mode === "MODE_SYNC"
            ? "triggerSyncMultipart"
            : "triggerAsyncMultipart",
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

  const formIsDirty = useCreateResourceFormStore((state) => state.formIsDirty);

  useWarnUnsavedChanges({
    router,
    haveUnsavedChanges: formIsDirty,
    confirmation:
      "You have unsaved changes, are you sure you want to leave this page?",
    callbackWhenLeave: null,
  });

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const enableGuard = useCreateUpdateDeleteResourceGuard();

  const watchPipelineState = useWatchPipeline({
    enabled: true,
    pipelineName: pipeline.name,
    accessToken: null,
  });

  const deActivatePipeline = useDeActivatePipeline();
  const activatePipeline = useActivatePipeline();

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title={pipeline.name} />
      <div className="flex flex-col">
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
            state={
              watchPipelineState.isSuccess
                ? watchPipelineState.data.state
                : "STATE_UNSPECIFIED"
            }
          />
        </div>
        <PipelineTable
          pipeline={pipeline}
          marginBottom="mb-10"
          isError={watchPipelineState.isError}
          isLoading={watchPipelineState.isLoading}
        />
        <ChangePipelineStateToggle
          pipeline={pipeline}
          pipelineWatchState={
            watchPipelineState.isSuccess ? watchPipelineState.data.state : null
          }
          switchOn={activatePipeline}
          switchOff={deActivatePipeline}
          marginBottom="mb-10"
          accessToken={null}
          disabled={enableGuard}
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        <ConfigurePipelineForm
          pipeline={pipeline}
          marginBottom="mb-10"
          accessToken={null}
          onDelete={(initStore) => {
            initStore();
            router.push("/pipelines");
          }}
          disabledDelete={enableGuard}
          onConfigure={null}
          disabledConfigure={enableGuard}
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
      </div>
    </>
  );
};

PipelineDetailsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelineDetailsPage;
