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
import { SingleSelectOption, SolidButton } from "@instill-ai/design-system";

import { SingleSelect } from "@/components/formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { useModelsInstances } from "@/services/model";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type UseExistingModeInstancelFlowProps = StepNumberState & {
  setModelCreated: Dispatch<SetStateAction<boolean>>;
  modelCreated: boolean;
};

export const UseExistingModeInstancelFlow: FC<
  UseExistingModeInstancelFlowProps
> = ({ modelCreated, setStepNumber, stepNumber }) => {
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
    if (!values.model.existing.modelInstanceTag || !modelInstanceOptions)
      return null;

    return (
      modelInstanceOptions.find(
        (e) => e.value === values.model.existing.modelInstanceTag
      ) || null
    );
  }, [values.model.existing.modelInstanceTag, modelInstanceOptions]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Setup existing model                                        #
  // #                                                                 #
  // ###################################################################

  const canUseExistingModel = useMemo(() => {
    if (!values.model.existing.modelInstanceTag) {
      return false;
    }

    return true;
  }, [values.model.existing.modelInstanceTag]);

  const handleUseModel = useCallback(() => {
    if (
      !values.model.existing.modelInstanceTag ||
      !modelInstances.isSuccess ||
      !modelInstances.data
    ) {
      return;
    }

    const targetModelInstance = modelInstances.data.find(
      (e) => e.name === values.model.existing.modelInstanceTag
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
    values.model.existing.modelInstanceTag,
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
        Select an existing online model instance
      </h3>
      <SingleSelect
        id="existingModelInstanceTag"
        name="model.existing.modelInstanceTag"
        label="Online model instances"
        options={modelInstanceOptions ? modelInstanceOptions : []}
        value={selectedModelInstanceOption}
        error={errors.model?.existing?.modelInstanceTag || null}
        disabled={modelCreated ? true : false}
        required={true}
      />
      <SolidButton
        position="ml-auto"
        type="button"
        color="primary"
        disabled={modelCreated ? true : canUseExistingModel ? false : true}
        onClickHandler={handleUseModel}
      >
        Select
      </SolidButton>
    </div>
  );
};
