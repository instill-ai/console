import { FC, ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

import {
  useDeployModel,
  useModel,
  useUnDeployModel,
  usePipelines,
  ChangeModelStateToggle,
  useWarnUnsavedChanges,
  useConfigureModelFormStore,
  ConfigureModelForm,
  PipelinesTable,
  StateLabel,
  ModelTaskLabel,
  ModelDefinitionLabel,
  useModelReadme,
  ModelConfigurationFields,
  useCreateUpdateDeleteResourceGuard,
  useWatchModel,
  useWatchPipelines,
  type Pipeline,
  type ConfigureModelFormStore,
  getComponentFromPipelineRecipe,
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

  const enableGuard = useCreateUpdateDeleteResourceGuard();

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
    enabled: true,
    modelName: id ? `models/${id}` : null,
    accessToken: null,
  });

  const modelWatchState = useWatchModel({
    enabled: true,
    modelName: id ? `models/${id}` : null,
    accessToken: null,
  });

  /* -------------------------------------------------------------------------
   * Initialize pipelines that use this model
   * -----------------------------------------------------------------------*/

  const pipelines = usePipelines({ enabled: true, accessToken: null });

  const pipelinesUseThisModel = useMemo(() => {
    if (!pipelines.isSuccess || !pipelines.data) {
      return [];
    }

    return pipelines.data.filter((pipeline: Pipeline) => {
      const models =
        getComponentFromPipelineRecipe({
          recipe: pipeline.recipe,
          componentName: "model",
        }) ?? [];
      return models.some((e) => e.id === id);
    });
  }, [pipelines.isSuccess, pipelines.data, id]);

  const pipelinesWatchState = useWatchPipelines({
    enabled: pipelinesUseThisModel.length > 0,
    accessToken: null,
    pipelineNames:
      pipelinesUseThisModel.length > 0
        ? pipelinesUseThisModel.map((e) => e.name)
        : null,
  });

  /* -------------------------------------------------------------------------
   * Get model card
   * -----------------------------------------------------------------------*/

  const modelReadme = useModelReadme({
    modelName: `models/${id}`,
    accessToken: null,
    enabled: id ? true : false,
  });

  /* -------------------------------------------------------------------------
   * Toggle model state
   * -----------------------------------------------------------------------*/

  const deployModel = useDeployModel();
  const unDeployModel = useUnDeployModel();

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title={`models/${id}`} />
      <PageContentContainer>
        <PageTitle
          title={`${id?.toString()}`}
          breadcrumbs={id ? ["Model", id.toString()] : ["Model"]}
          enableButton={false}
          marginBottom="mb-5"
        />
        <div className="mb-10 flex flex-row gap-x-2.5">
          <ModelDefinitionLabel
            modelDefinition={model.data ? model.data.model_definition : null}
          />
          <ModelTaskLabel task={model.isSuccess ? model.data.task : null} />
          <StateLabel
            enableBgColor={true}
            enableIcon={true}
            state={
              modelWatchState.isSuccess
                ? modelWatchState.data.state
                : "STATE_UNSPECIFIED"
            }
            iconHeight="h-3"
            iconWidth="w-3"
            iconPosition="my-auto"
          />
        </div>
        <ChangeModelStateToggle
          model={model.data ? model.data : null}
          modelWatchState={
            modelWatchState.isSuccess ? modelWatchState.data.state : null
          }
          switchOn={deployModel}
          switchOff={unDeployModel}
          marginBottom="mb-10"
          accessToken={null}
          disabled={enableGuard}
        />
        {model.isSuccess && model.data ? (
          <ConfigureModelForm
            model={model.data}
            marginBottom="mb-[60px]"
            onConfigure={null}
            disabledConfigure={enableGuard}
            onDelete={() => router.push("/models")}
            disabledDelete={enableGuard}
            accessToken={null}
          />
        ) : null}

        <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
        <PipelinesTable
          pipelines={pipelinesUseThisModel}
          pipelinesWatchState={
            pipelinesWatchState.isSuccess ? pipelinesWatchState.data : {}
          }
          isLoading={
            pipelines.isLoading || pipelinesUseThisModel.length > 0
              ? pipelinesWatchState.isLoading
              : false
          }
          isError={pipelines.isError || pipelinesWatchState.isError}
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

export default ModelDetailsPage;
