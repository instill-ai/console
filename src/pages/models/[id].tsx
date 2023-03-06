import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import {
  BasicSingleSelect,
  SingleSelectOption,
} from "@instill-ai/design-system";

import {
  useDeployModelInstance,
  useModel,
  useModelInstanceReadme,
  useModelInstances,
  useUnDeployModelInstance,
} from "@/services/model";
import {
  HorizontalDivider,
  ModelDefinitionLabel,
  StateLabel,
  ModelInstanceTaskLabel,
  PipelinesTable,
  PageTitle,
  ModelInstanceReadmeCard,
  ChangeResourceStateButton,
  PageBase,
  PageContentContainer,
  PageHead,
  TableLoadingProgress,
} from "@/components/ui";
import {
  ConfigureModelForm,
  ConfigureModelInstanceForm,
} from "@/components/model";
import { Nullable } from "@/types/general";
import { usePipelines } from "@/services/pipeline";
import { Pipeline } from "@/lib/instill";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData, useStateOverviewCounts } from "@/hooks";

type GetLayOutProps = {
  page: ReactElement;
};

const ModelDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  // ##########################################################################
  // # 1 - Initialize Model and related modelInstances                        #
  // ##########################################################################

  const model = useModel(id ? `models/${id}` : null);

  const modelInstances = useModelInstances(
    model.isSuccess ? model.data.name : null
  );

  const modelInstanceOptions = useMemo<SingleSelectOption[]>(() => {
    if (!modelInstances.isSuccess || !router.isReady) return [];

    return modelInstances.data.map((modelInstance) => {
      return {
        label: modelInstance.id,
        value: modelInstance.id,
      };
    });
  }, [router.isReady, modelInstances.isSuccess, modelInstances.data]);

  const [selectedModelInstanceOption, setSelectedModelInstanceOption] =
    useState<Nullable<SingleSelectOption>>(null);

  useEffect(() => {
    if (!modelInstances.isSuccess) return;

    if (!selectedModelInstanceOption) {
      setSelectedModelInstanceOption(
        modelInstances.isSuccess
          ? {
              value: modelInstances.data[0].id,
              label: modelInstances.data[0].id,
            }
          : null
      );
    }
  }, [
    modelInstances.isSuccess,
    modelInstances.data,
    selectedModelInstanceOption,
  ]);

  const selectedModelInstances = useMemo(() => {
    if (!selectedModelInstanceOption || !modelInstances.isSuccess) return null;

    return (
      modelInstances.data.find(
        (e) => e.id === selectedModelInstanceOption.value
      ) || null
    );
  }, [
    selectedModelInstanceOption,
    modelInstances.isSuccess,
    modelInstances.data,
  ]);

  const modelInstanceOnChangeCb = useCallback(
    (option: Nullable<SingleSelectOption>) => {
      if (!option) return;

      setSelectedModelInstanceOption(option);
    },
    []
  );

  // ##########################################################################
  // # 2 - Initialize pipelines that use related modelInstane                 #
  // ##########################################################################

  const pipelines = usePipelines(true);

  const pipelinesGroupByModelInstance = useMemo(() => {
    if (!pipelines.isSuccess || !modelInstances.isSuccess || !pipelines.data) {
      return {};
    }

    const pipelinesGroup: Record<string, Pipeline[]> = {};

    for (const modelInstance of modelInstances.data) {
      const targetPipelines = pipelines.data.filter((e) => {
        if (e.recipe.models.find((e) => e.name === modelInstance.name)) {
          return true;
        } else {
          false;
        }
      });
      pipelinesGroup[modelInstance.id] = targetPipelines;
    }
    return pipelinesGroup;
  }, [
    pipelines.isSuccess,
    pipelines.data,
    modelInstances.isSuccess,
    modelInstances.data,
  ]);

  const selectedModelInstancePipelines = useMemo(() => {
    if (!selectedModelInstances || !pipelinesGroupByModelInstance) return [];

    return pipelinesGroupByModelInstance[selectedModelInstances.id];
  }, [pipelinesGroupByModelInstance, selectedModelInstances]);

  // ##########################################################################
  // # Get model instance's readme                                            #
  // ##########################################################################

  const modelInstanceReadme = useModelInstanceReadme(
    modelInstances.data?.find(
      (e) => e.id === selectedModelInstanceOption?.value
    )?.name ?? null
  );

  // ##########################################################################
  // # Toggle the model instance state                                        #
  // ##########################################################################

  const deployModelInstance = useDeployModelInstance();
  const unDeployModelInstance = useUnDeployModelInstance();

  // ##########################################################################
  // # Send page loaded data to Amplitude                                     #
  // ##########################################################################

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_model_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  const pageTitle = useMemo(() => {
    if (!selectedModelInstances) return null;

    const nameList = selectedModelInstances.name.split("/");

    return `${nameList[1]}/${nameList[3]}`;
  }, [selectedModelInstances]);

  return (
    <>
      <PageHead title={pageTitle ? pageTitle : ""} />
      <PageContentContainer>
        <PageTitle
          title={id ? id.toString() : ""}
          breadcrumbs={id ? ["Model", id.toString()] : ["Model"]}
          displayButton={false}
          marginBottom="mb-5"
        />
        <ModelDefinitionLabel
          modelDefinition={model.data ? model.data.model_definition : null}
          marginBottom="mb-5"
          position="mr-auto"
        />
        {model.isSuccess && model.data ? (
          <ConfigureModelForm model={model.data} marginBottom="mb-[60px]" />
        ) : null}
        <HorizontalDivider
          borderColor="border-instillGrey30"
          marginBottom="mb-10"
        />
        <div className="mb-5 flex flex-row gap-x-2.5">
          <h2 className="my-auto text-black text-instill-h2 ">{`${
            model.isSuccess ? model.data.id : ""
          }`}</h2>
          <BasicSingleSelect
            id="modelInstanceTag"
            instanceId="modelInstanceTag"
            menuPlacement="auto"
            label={null}
            additionalMessageOnLabel={null}
            description=""
            disabled={false}
            readOnly={false}
            required={false}
            error={null}
            value={selectedModelInstanceOption}
            options={modelInstanceOptions}
            onChange={modelInstanceOnChangeCb}
          />
        </div>
        <div className="mb-10 flex flex-row gap-x-2.5">
          <ModelInstanceTaskLabel
            task={selectedModelInstances ? selectedModelInstances.task : null}
            marginBottom={null}
            position={null}
          />
          <StateLabel
            enableBgColor={true}
            enableIcon={true}
            state={
              selectedModelInstances
                ? selectedModelInstances.state
                : "STATE_UNSPECIFIED"
            }
            paddingX="px-[5px]"
            paddingY="py-[5px]"
            iconHeight="h-3"
            iconWidth="w-3"
            iconPosition="my-auto"
          />
        </div>
        <ChangeResourceStateButton
          resource={selectedModelInstances}
          switchOn={deployModelInstance}
          switchOff={unDeployModelInstance}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">In use by pipelines</h3>
        <PipelinesTable
          pipelines={selectedModelInstancePipelines}
          marginBottom="mb-10"
        />
        <h3 className="mb-5 text-black text-instill-h3">Setting</h3>
        {modelInstances.isLoading ? null : selectedModelInstances ? (
          <>
            <ModelInstanceReadmeCard
              isLoading={modelInstanceReadme.isLoading}
              markdown={
                modelInstanceReadme.isSuccess ? modelInstanceReadme.data : null
              }
              marginBottom="mb-5"
            />
            <ConfigureModelInstanceForm
              modelInstance={selectedModelInstances}
              marginBottom="mb-10"
            />
          </>
        ) : null}
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
