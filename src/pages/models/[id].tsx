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

import { PageBase, PageContentContainer } from "@/components/layouts";
import { useModel, useModelWithInstances } from "@/services/model";
import {
  HorizontalDivider,
  ModelDefinitionLabel,
  StateLabel,
  ModelInstanceTaskLabel,
  PipelinesTable,
  PageTitle,
} from "@/components/ui";
import {
  ConfigureModelForm,
  ConfigureModelInstanceForm,
} from "@/components/forms";
import { Nullable } from "@/types/general";
import { usePipelines } from "@/services/pipeline";
import { Pipeline } from "@/lib/instill";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { useSendAmplitudeData } from "@/hooks/useSendAmplitudeData";
import TestModelInstanceForm from "@/components/forms/TestModelInstanceForm/TestModelInstanceForm";

interface GetLayOutProps {
  page: ReactElement;
}

// export type SourceDetailsPageProps = {
//   fields: any;
// };

const ModelDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize Model and related modelInstances                 #
  // #                                                                 #
  // ###################################################################

  const model = useModel(id ? `models/${id}` : null);

  const modelWithInstances = useModelWithInstances(
    model.isSuccess ? model.data : null
  );

  const modelInstanceOptions = useMemo<SingleSelectOption[]>(() => {
    if (!modelWithInstances.isSuccess || !router.isReady) return [];

    return modelWithInstances.data.instances.map((modelInsance) => {
      return {
        label: modelInsance.id,
        value: modelInsance.id,
      };
    });
  }, [
    router.isReady,
    modelWithInstances.isSuccess,
    modelWithInstances.data?.instances,
  ]);

  const [selectedModelInstanceOption, setSelectedModelInstanceOption] =
    useState<Nullable<SingleSelectOption>>(null);

  useEffect(() => {
    if (!modelWithInstances.isSuccess) return;

    setSelectedModelInstanceOption(
      modelWithInstances.isSuccess
        ? {
            value: modelWithInstances.data.instances[0].id,
            label: modelWithInstances.data.instances[0].id,
          }
        : null
    );
  }, [modelWithInstances.isSuccess, modelWithInstances.data?.instances]);

  const selectedModelInstances = useMemo(() => {
    if (!selectedModelInstanceOption || !modelWithInstances.isSuccess)
      return null;

    return (
      modelWithInstances.data.instances.find(
        (e) => e.id === selectedModelInstanceOption.value
      ) || null
    );
  }, [
    selectedModelInstanceOption,
    modelWithInstances.isSuccess,
    modelWithInstances.data?.instances,
  ]);

  const modelInstanceOnChangeCb = useCallback(
    (_: string, option: SingleSelectOption) => {
      if (!option) return;

      setSelectedModelInstanceOption(option);
    },
    []
  );

  // ###################################################################
  // #                                                                 #
  // # 2 - Initialize pipelines that use related modelInstane          #
  // #                                                                 #
  // ###################################################################

  const pipelines = usePipelines(true);

  const pipelinesGroupByModelInstance = useMemo(() => {
    if (
      !pipelines.isSuccess ||
      !modelWithInstances.isSuccess ||
      !pipelines.data
    ) {
      return {};
    }

    const pipelinesGroup: Record<string, Pipeline[]> = {};

    for (const modelInstance of modelWithInstances.data.instances) {
      const targetPipelines = pipelines.data.filter((e) => {
        if (e.recipe.models.find((e) => e.id === modelInstance.id)) {
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
    modelWithInstances.isSuccess,
    modelWithInstances.data?.instances,
  ]);

  const selectedModelInstancePipelines = useMemo(() => {
    if (!selectedModelInstances || !pipelinesGroupByModelInstance) return [];

    return pipelinesGroupByModelInstance[selectedModelInstances.id];
  }, [pipelinesGroupByModelInstance, selectedModelInstances]);

  // ###################################################################
  // #                                                                 #
  // # Send page loaded data to Amplitude                              #
  // #                                                                 #
  // ###################################################################

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_model_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <PageContentContainer>
      <PageTitle
        title={id ? id.toString() : ""}
        breadcrumbs={id ? ["Model", id.toString()] : ["Model"]}
        enableButton={false}
        marginBottom="mb-5"
      />
      <ModelDefinitionLabel
        modelDefinition={model.data ? model.data.model_definition : null}
        marginBottom="mb-5"
        position="mr-auto"
      />
      <ConfigureModelForm
        model={model.isSuccess ? model.data : null}
        marginBottom="mb-[60px]"
      />
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
          description={null}
          disabled={false}
          readOnly={false}
          required={false}
          error={null}
          value={selectedModelInstanceOption}
          options={modelInstanceOptions}
          onChangeInput={modelInstanceOnChangeCb}
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
          state={selectedModelInstances ? selectedModelInstances.state : null}
          paddingX="px-[5px]"
          paddingY="py-[5px]"
          iconHeight="h-3"
          iconWidth="w-3"
          iconPosition="my-auto"
        />
      </div>
      <h3 className="mb-5 text-black text-instill-h3">Overview</h3>
      <PipelinesTable
        pipelines={selectedModelInstancePipelines}
        isLoadingPipeline={pipelines.isLoading}
        marginBottom="mb-10"
        enablePlaceholderCreateButton={false}
      />
      <h3 className="mb-5 text-black text-instill-h3">Settings</h3>
      {modelWithInstances.isLoading ? null : selectedModelInstances ? (
        <>
          <ConfigureModelInstanceForm
            modelInstance={selectedModelInstances}
            marginBottom="mb-10"
          />
          <TestModelInstanceForm modelInstance={selectedModelInstances} />
        </>
      ) : null}
    </PageContentContainer>
  );
};

ModelDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default ModelDetailsPage;
