import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { useRouter } from "next/router";
import {
  useModel,
  useModelWithInstances,
} from "@/services/model/ModelServices";
import {
  HorizontalDivider,
  ModelDefinitionLabel,
  StateLabel,
} from "@/components/ui";
import {
  ConfigureModelForm,
  ConfigureModelInstanceForm,
} from "@/components/forms";
import { ModelInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";
import {
  BasicSingleSelect,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { SingleSelect } from "@/components/formik";
import ModelInstanceTaskLabel from "@/components/ui/ModelInstanceTaskLabel/ModelInstanceTaskLabel";

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

  const model = useModel(id ? `models/${id}` : null);

  const modelWithInstances = useModelWithInstances(
    model.isSuccess ? model.data : null
  );

  //const [modelInstanceOptions, setModelInstanceOptions] = use

  const modelInstanceOptions = useMemo<SingleSelectOption[]>(() => {
    if (!modelWithInstances.isSuccess || !router.isReady) return [];

    return modelWithInstances.data.instances.map((modelInsance) => {
      return {
        label: modelInsance.id,
        value: modelInsance.id,
      };
    });
  }, [modelWithInstances.isSuccess, router.isReady]);

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
  }, [modelWithInstances.isSuccess]);

  const selectedModelInstances = useMemo(() => {
    if (!selectedModelInstanceOption || !modelWithInstances.isSuccess)
      return null;

    return (
      modelWithInstances.data.instances.find(
        (e) => e.id === selectedModelInstanceOption.value
      ) || null
    );
  }, [selectedModelInstanceOption, modelWithInstances.isSuccess]);

  const modelInstanceOnChangeCb = useCallback(
    (_: string, option: SingleSelectOption) => {
      if (!option) return;

      setSelectedModelInstanceOption(option);
    },
    []
  );

  return (
    <PageContentContainer>
      <PageTitle
        title={id ? id.toString() : ""}
        breadcrumbs={id ? ["Data Source", id.toString()] : ["Data Source"]}
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
        <h2 className="instill-text-h2 my-auto text-black ">{`${
          model.isSuccess ? model.data.id : ""
        }`}</h2>
        <BasicSingleSelect
          id="model-instance-tag"
          instanceId="model-instance-tag"
          menuPlacement="auto"
          label={null}
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
      <h3 className="instill-text-h3 mb-5 text-black">Overview</h3>
      <h3 className="instill-text-h3 mb-5 text-black">Settings</h3>
      {modelWithInstances.isLoading ? null : selectedModelInstances ? (
        <ConfigureModelInstanceForm
          modelInstance={selectedModelInstances}
          marginBottom="mb-10"
        />
      ) : null}
    </PageContentContainer>
  );
};

ModelDetailsPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default ModelDetailsPage;
