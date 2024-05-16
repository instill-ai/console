"use client";

import * as React from "react";
import cn from "clsx";
import {
  EntityAvatar,
  ModelDefinitionLabel,
  ModelTaskLabel,
  PageTitle,
  StateLabel,
} from "../../components";
import {
  GeneralAppPageProp,
  Nullable,
  useAppEntity,
  useDeployUserModel,
  useUndeployUserModel,
  useUserModel,
  useUserModelReadme,
  useWatchUserModel,
} from "../../lib";
import { ChangeModelStateToggle } from "./ChangeModelStateToggle";

import { ModelConfigurationFields } from "./ModelConfigurationFields";
import Markdown from "markdown-to-jsx";
import {
  GitHubIcon,
  Icons,
  NoBgSquareProgress,
  getModelInstanceTaskToolkit,
  Tag,
  TabMenu,
} from "@instill-ai/design-system";
import { useParams } from "next/navigation";
import {
  ModelSettingsContentViewer,
  ModelSettingsHead,
  ModelSettingsTabs,
} from "./view-settings";

export type ModelHubSettingPageMainViewProps = GeneralAppPageProp & {
  disabledConfigureModel: boolean;
};

const ExternalLink = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-row items-center gap-x-1 border-b border-zinc-700 text-sm font-semibold text-semantic-bg-secondary-alt-primary"
    >
      {children}
    </a>
  );
};

export const ModelHubSettingPageMainView = (
  props: ModelHubSettingPageMainViewProps
) => {
  const { accessToken, enableQuery, router, disabledConfigureModel } = props;
  const { id, entity } = useParams();

  const entityObject = useAppEntity();

  const [selectedTab, setSelectedTab] =
    React.useState<ModelSettingsTabs>("overview");

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const model = useUserModel({
    modelName: entityObject.isSuccess ? entityObject.data.modelName : null,
    enabled: enableQuery && entityObject.isSuccess,
    accessToken,
  });

  const modelReadme = useUserModelReadme({
    modelName: entityObject.isSuccess ? entityObject.data.modelName : null,
    enabled: enableQuery && entityObject.isSuccess,
    accessToken,
  });

  const modelWatchState = useWatchUserModel({
    modelName: entityObject.isSuccess ? entityObject.data.modelName : null,
    enabled: enableQuery && entityObject.isSuccess,
    accessToken,
  });
  console.log(model?.data);
  /* -------------------------------------------------------------------------
   * Toggle model state
   * -----------------------------------------------------------------------*/

  const deployModel = useDeployUserModel();
  const unDeployModel = useUndeployUserModel();

  return (
    <div className="flex flex-col">
      <ModelSettingsHead
        onTabChange={setSelectedTab}
        selectedTab={selectedTab}
        model={model.data}
      />
      <ModelSettingsContentViewer
        selectedTab={selectedTab}
        model={model.data}
        onUpdate={model.refetch}
      />
      {/* <PageTitle
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

      <div
        className={cn(
          "flex w-full flex-col border border-semantic-bg-line bg-semantic-bg-primary p-5",
          { "min-h-[200px]": !modelReadme.isSuccess || !modelReadme.data }
        )}
      >
        {modelReadme.isSuccess ? (
          modelReadme.data ? (
            <Markdown>{modelReadme.data}</Markdown>
          ) : (
            <React.Fragment>
              <h3 className="mx-auto mb-1 mt-auto text-semantic-fg-primary product-headings-heading-4">
                There is no Model card
              </h3>
              <p className="mx-auto mb-auto text-semantic-fg-secondary product-body-text-3-regular">
                You can add a README.md to describe the model.
              </p>
            </React.Fragment>
          )
        ) : (
          <div className="bg-instillBlue10 m-auto flex h-[72px] w-[72px]">
            <NoBgSquareProgress
              isLoading={true}
              blockSize={52}
              position="m-auto"
            />
          </div>
        )}
      </div>
      <ModelConfigurationFields
        model={model.isSuccess ? model.data : null}
        marginBottom="mb-10"
      /> */}
    </div>
  );
};
