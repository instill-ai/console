import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

import {
  useDeployModel,
  useUnDeployModel,
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
  useModelWithPipelines,
  type ConfigureModelFormStore,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageHead,
  ModelReadmeMarkdown,
  Topbar,
  Sidebar,
  PageBase,
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
   * Query resource data
   * -----------------------------------------------------------------------*/

  const modelWithPipelines = useModelWithPipelines({
    enabled: true,
    modelName: id ? `models/${id}` : null,
    accessToken: null,
  });

  const modelWatchState = useWatchModel({
    enabled: true,
    modelName: id ? `models/${id}` : null,
    accessToken: null,
  });

  const pipelinesWatchState = useWatchPipelines({
    enabled:
      modelWithPipelines.isSuccess &&
      modelWithPipelines.data.pipelines.length > 0,
    accessToken: null,
    pipelineNames: modelWithPipelines.isSuccess
      ? modelWithPipelines.data?.pipelines.map((e) => e.name)
      : [],
  });

  const isLoadingPipelines = modelWithPipelines.isLoading
    ? true
    : modelWithPipelines.isSuccess &&
      modelWithPipelines.data?.pipelines.length > 0
    ? pipelinesWatchState.isLoading
    : false;

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
      <div className="flex flex-col">
        <PageTitle
          title={`${id?.toString()}`}
          breadcrumbs={id ? ["Model", id.toString()] : ["Model"]}
          disabledButton={true}
          marginBottom="mb-5"
        />
        <div className="mb-10 flex flex-row gap-x-2.5">
          <ModelDefinitionLabel
            modelDefinition={
              modelWithPipelines.isSuccess
                ? modelWithPipelines.data.model_definition
                : null
            }
          />
          <ModelTaskLabel
            task={
              modelWithPipelines.isSuccess ? modelWithPipelines.data.task : null
            }
          />
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
          model={modelWithPipelines.isSuccess ? modelWithPipelines.data : null}
          modelWatchState={
            modelWatchState.isSuccess ? modelWatchState.data.state : null
          }
          switchOn={deployModel}
          switchOff={unDeployModel}
          marginBottom="mb-10"
          accessToken={null}
          disabled={enableGuard}
        />
        {modelWithPipelines.isSuccess ? (
          <ConfigureModelForm
            model={modelWithPipelines.data}
            marginBottom="mb-[60px]"
            onConfigure={null}
            disabledConfigure={enableGuard}
            onDelete={(initStore) => {
              initStore();
              router.push("/model-hub");
            }}
            disabledDelete={enableGuard}
            accessToken={null}
          />
        ) : null}

        <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
        <PipelinesTable
          pipelines={
            modelWithPipelines.isSuccess
              ? modelWithPipelines.data.pipelines
              : []
          }
          pipelinesWatchState={
            pipelinesWatchState.isSuccess ? pipelinesWatchState.data : {}
          }
          isLoading={isLoadingPipelines}
          isError={modelWithPipelines.isError || pipelinesWatchState.isError}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        <ModelReadmeMarkdown
          isLoading={modelReadme.isLoading}
          markdown={modelReadme.isSuccess ? modelReadme.data : null}
          marginBottom="mb-5"
        />
        <ModelConfigurationFields
          model={modelWithPipelines.isSuccess ? modelWithPipelines.data : null}
          marginBottom="mb-10"
        />
      </div>
    </>
  );
};

ModelDetailsPage.getLayout = (page) => {
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

export default ModelDetailsPage;
