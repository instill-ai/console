import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

import {
  ChangeModelStateToggle,
  useWarnUnsavedChanges,
  useConfigureModelFormStore,
  ConfigureModelForm,
  StateLabel,
  ModelTaskLabel,
  ModelDefinitionLabel,
  ModelConfigurationFields,
  useCreateUpdateDeleteResourceGuard,
  type ConfigureModelFormStore,
  useUserModel,
  useUser,
  useWatchUserModel,
  useUserModelReadme,
  useDeployUserModel,
  useUndeployUserModel,
} from "@instill-ai/toolkit";

import {
  PageTitle,
  PageHead,
  ModelReadmeMarkdown,
  Topbar,
  Sidebar,
  PageBase,
} from "@/components";
import { Logo } from "@instill-ai/design-system";

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

  const user = useUser({
    enabled: true,
    accessToken: null,
  });

  const model = useUserModel({
    enabled: user.isSuccess,
    modelName: user.isSuccess
      ? id
        ? `${user.data?.name}/models/${id}`
        : null
      : null,
    accessToken: null,
  });

  const modelWatchState = useWatchUserModel({
    enabled: user.isSuccess,
    modelName: user.isSuccess
      ? id
        ? `${user.data?.name}/models/${id}`
        : null
      : null,
    accessToken: null,
  });

  /* -------------------------------------------------------------------------
   * Get model card
   * -----------------------------------------------------------------------*/

  const modelReadme = useUserModelReadme({
    modelName: user.isSuccess
      ? id
        ? `${user.data?.name}/models/${id}`
        : null
      : null,
    accessToken: null,
    enabled: user.isSuccess ? (id ? true : false) : false,
  });

  /* -------------------------------------------------------------------------
   * Toggle model state
   * -----------------------------------------------------------------------*/

  const deployUserModel = useDeployUserModel();
  const undeployUserModel = useUndeployUserModel();

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
              model.isSuccess ? model.data.model_definition : null
            }
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
          model={model.isSuccess ? model.data : null}
          modelWatchState={
            modelWatchState.isSuccess ? modelWatchState.data.state : null
          }
          switchOn={deployUserModel}
          switchOff={undeployUserModel}
          marginBottom="mb-10"
          accessToken={null}
          disabled={enableGuard}
        />
        {model.isSuccess ? (
          <ConfigureModelForm
            model={model.data}
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
      </div>
    </>
  );
};

ModelDetailsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="ColourLogomarkWhiteType" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default ModelDetailsPage;
