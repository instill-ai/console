import { FC, ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

import {
  useDeployModel,
  useModel,
  useUnDeployModel,
  usePipelines,
  ChangeModelStateToggle,
  useSendAmplitudeData,
  useWarnUnsavedChanges,
  useConfigureModelFormStore,
  ConfigureModelForm,
  PipelinesTable,
  StateLabel,
  ModelTaskLabel,
  ModelDefinitionLabel,
  useModelReadme,
  ModelConfigurationFields,
  type Pipeline,
  type ConfigureModelFormStore,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
  ModelReadmeMarkdown,
} from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const selector = (state: ConfigureModelFormStore) => ({
  formIsDirty: state.formIsDirty,
  init: state.init,
});

const ModelDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;
  const { formIsDirty, init } = useConfigureModelFormStore(selector, shallow);

  useWarnUnsavedChanges({
    router,
    haveUnsavedChanges: formIsDirty,
    confirmation:
      "You have unsaved changes, are you sure you want to leave this page?",
    callbackWhenLeave: () => init(),
  });

  /* -------------------------------------------------------------------------
   * Initialize model and modelInstances state
   * -----------------------------------------------------------------------*/

  const model = useModel({
    modelName: id ? `models/${id}` : null,
    accessToken: null,
    enable: true,
  });

  console.log(model.data);

  /* -------------------------------------------------------------------------
   * Initialize pipelines that use this model
   * -----------------------------------------------------------------------*/

  const pipelines = usePipelines({ enable: true, accessToken: null });

  const pipelinesUseThisModel = useMemo(() => {
    if (!pipelines.isSuccess || !pipelines.data) {
      return [];
    }

    return pipelines.data.filter((pipeline: Pipeline) => {
      return pipeline.recipe.models.some((e) => e.name === `models/${id}`);
    });
  }, [pipelines.isSuccess, pipelines.data, id]);

  /* -------------------------------------------------------------------------
   * Get model card
   * -----------------------------------------------------------------------*/

  const modelReadme = useModelReadme({
    modelName: `models/${id}`,
    accessToken: null,
    enable: true,
  });

  /* -------------------------------------------------------------------------
   * Toggle model state
   * -----------------------------------------------------------------------*/

  const deployModel = useDeployModel();
  const unDeployModel = useUnDeployModel();

  useSendAmplitudeData(
    "hit_model_page",
    { type: "navigation" },
    router.isReady
  );

  return (
    <>
      <PageHead title={`models/${id}`} />
      <PageContentContainer>
        <PageTitle
          title={`models/${id?.toString()}`}
          breadcrumbs={id ? ["Model", id.toString()] : ["Model"]}
          enableButton={false}
          marginBottom="mb-5"
        />
        <div className="mb-10 flex flex-row gap-x-2.5">
          <ModelDefinitionLabel
            modelDefinition={model.data ? model.data.model_definition : null}
            marginBottom={null}
            position={null}
          />
          <ModelTaskLabel
            task={model.isSuccess ? model.data.task : null}
            marginBottom={null}
            position={null}
          />
          <StateLabel
            enableBgColor={true}
            enableIcon={true}
            state={model.isSuccess ? model.data.state : "STATE_UNSPECIFIED"}
            iconHeight="h-3"
            iconWidth="w-3"
            iconPosition="my-auto"
          />
        </div>
        <ChangeModelStateToggle
          model={model.data ? model.data : null}
          switchOn={deployModel}
          switchOff={unDeployModel}
          marginBottom="mb-10"
          accessToken={null}
        />
        {model.isSuccess && model.data ? (
          <ConfigureModelForm
            model={model.data}
            marginBottom="mb-[60px]"
            onConfigure={null}
            onDelete={() => router.push("/models")}
          />
        ) : null}

        <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
        <PipelinesTable
          pipelines={pipelinesUseThisModel}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        <ModelReadmeMarkdown
          isLoading={modelReadme.isLoading}
          markdown={modelReadme.isSuccess ? modelReadme.data : null}
          marginBottom="mb-5"
        />
        <ModelConfigurationFields
          model={model.isSuccess ? model.data : null}
          marginBottom="mb-10"
        />
      </PageContentContainer>
    </>
  );
};

ModelDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

// We need this line to make our code-hike snippet work under Next.js standalone server
// https://github.com/code-hike/codehike/issues/283
export const config = {
  unstable_includeFiles: ["node_modules/.pnpm/**/shiki/**/*.json"],
};

export default ModelDetailsPage;
