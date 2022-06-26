import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui";
import { SingleSelect } from "../../../formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { useModelsInstances } from "@/services/model";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type UseExistingModelFlowProps = StepNumberState & {
  setModelCreated: Dispatch<SetStateAction<boolean>>;
  modelCreated: boolean;
};

const UseExistingModelFlow: FC<UseExistingModelFlowProps> = ({
  modelCreated,
  setStepNumber,
  stepNumber,
}) => {
  const { values, setFieldValue, errors } =
    useFormikContext<CreatePipelineFormValues>();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Get existing model instances.                               #
  // #                                                                 #
  // ###################################################################

  const [modelInstanceOptions, setModelInstanceOptions] =
    useState<Nullable<SingleSelectOption[]>>(null);

  const modelInstances = useModelsInstances(modelCreated ? false : true);

  useEffect(() => {
    if (!modelInstances.isSuccess || !modelInstances.data) return;

    const onlineModelInstances = modelInstances.data.filter(
      (e) => e.state === "STATE_ONLINE"
    );

    setModelInstanceOptions(
      onlineModelInstances.map((e) => {
        const instanceNameList = e.name.split("/");
        const modelId = instanceNameList[1];

        return {
          label: `${modelId}/${e.id}`,
          value: e.name,
        };
      })
    );
  }, [modelInstances.isSuccess, modelInstances.data]);

  const selectedModelInstanceOption = useMemo(() => {
    if (!values.model.existing.modelInstanceName || !modelInstanceOptions)
      return null;

    console.log(values.model.existing.modelInstanceName);

    return (
      modelInstanceOptions.find(
        (e) => e.value === values.model.existing.modelInstanceName
      ) || null
    );
  }, [values.model.existing.modelInstanceName, modelInstanceOptions]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Setup existing model                                        #
  // #                                                                 #
  // ###################################################################

  const canUseExistingModel = useMemo(() => {
    if (!values.model.existing.modelInstanceName) {
      return false;
    }

    return true;
  }, [values.model.existing.modelInstanceName]);

  const handleUseModel = useCallback(() => {
    if (
      !values.model.existing.modelInstanceName ||
      !modelInstances.isSuccess ||
      !modelInstances.data
    ) {
      return;
    }

    const targetModelInstance = modelInstances.data.find(
      (e) => e.name === values.model.existing.modelInstanceName
    );

    if (!targetModelInstance) return;

    const instanceNameList = targetModelInstance.name.split("/");

    setFieldValue("model.type", "existing");
    setFieldValue("model.existing.id", instanceNameList[1]);

    if (amplitudeIsInit) {
      sendAmplitudeData("use_existing_model_instance", {
        type: "critical_action",
        process: "pipeline",
      });
    }

    setStepNumber(stepNumber + 1);
  }, [
    values.model.existing.modelInstanceName,
    modelInstances.isSuccess,
    modelInstances.data,
    setFieldValue,
    stepNumber,
    setStepNumber,
    amplitudeIsInit,
  ]);

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="text-black text-instill-h3">
        Select a existing online model
      </h3>
      <SingleSelect
        id="existingModelInstanceName"
        name="model.existing.modelInstanceName"
        label="Source type"
        additionalMessageOnLabel={null}
        options={modelInstanceOptions ? modelInstanceOptions : []}
        value={selectedModelInstanceOption}
        error={errors.model?.existing?.modelInstanceName || null}
        additionalOnChangeCb={null}
        disabled={modelCreated ? true : false}
        readOnly={false}
        required={true}
        description={"Setup Guide"}
        menuPlacement="auto"
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={modelCreated ? true : canUseExistingModel ? false : true}
        onClickHandler={handleUseModel}
      >
        Use model
      </PrimaryButton>
    </div>
  );
};

export default UseExistingModelFlow;
