import { ReactElement } from "react";
import {
  ModelDefinitionLabel,
  ModelTaskLabel,
  PageTitle,
  StateLabel,
} from "../../components";
import {
  GeneralPageProp,
  useDeployUserModel,
  useUndeployUserModel,
  useUserModel,
  useWatchUserModel,
} from "../../lib";
import { ChangeModelStateToggle } from "./ChangeModelStateToggle";
import { ConfigureModelForm } from "./ConfigureModelForm";
import { ModelConfigurationFields } from "./ModelConfigurationFields";

export type ModelHubSettingPageMainViewProps = GeneralPageProp & {
  modelReadme: ReactElement;
  modelNamespace: string;
  disabledConfigureModel: boolean;
};

export const ModelHubSettingPageMainView = (
  props: ModelHubSettingPageMainViewProps
) => {
  const {
    accessToken,
    enableQuery,
    router,
    modelReadme,
    modelNamespace,
    disabledConfigureModel,
  } = props;
  const { id, entity } = router.query;

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const model = useUserModel({
    modelName: id ? `users/${modelNamespace}/models/${id.toString()}` : null,
    enabled: enableQuery,
    accessToken,
  });

  const modelWatchState = useWatchUserModel({
    modelName: id ? `users/${modelNamespace}/models/${id.toString()}` : null,
    enabled: enableQuery,
    accessToken,
  });

  /* -------------------------------------------------------------------------
   * Toggle model state
   * -----------------------------------------------------------------------*/

  const deployModel = useDeployUserModel();
  const unDeployModel = useUndeployUserModel();

  return (
    <div className="flex flex-col">
      <PageTitle
        title={`${id?.toString()}`}
        breadcrumbs={["Models", "Model Settings"]}
        className="mb-5"
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
        accessToken={accessToken}
        disabled={disabledConfigureModel}
      />
      {model.isSuccess && model.data ? (
        <ConfigureModelForm
          model={model.data}
          marginBottom="mb-[60px]"
          onConfigure={null}
          onDelete={(initStore) => {
            initStore();
            router.push(`/${entity}/models`);
          }}
          accessToken={accessToken}
          width="w-full"
          disabledConfigure={disabledConfigureModel}
          disabledDelete={disabledConfigureModel}
        />
      ) : (
        <div className="bg-instillGrey15 mb-[60px] h-[120px] w-full animate-pulse lg:h-[320px]"></div>
      )}
      <h3 className="text-instill-h3 mb-5 text-black">Setting</h3>
      {modelReadme}
      <ModelConfigurationFields
        model={model.isSuccess ? model.data : null}
        marginBottom="mb-10"
      />
    </div>
  );
};
