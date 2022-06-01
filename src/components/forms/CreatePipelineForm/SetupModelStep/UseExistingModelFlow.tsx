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

import { PrimaryButton } from "@/components/ui/Buttons";
import { SingleSelect } from "../../../formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { useAllModeInstances } from "@/services/model/ModelServices";
import { Nullable } from "@instill-ai/design-system/build/types/general";

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

  // ###################################################################
  // #                                                                 #
  // # 1 - Get existing model instances.                               #
  // #                                                                 #
  // ###################################################################

  const [modelInstanceOptions, setModelInstanceOptions] =
    useState<Nullable<SingleSelectOption[]>>(null);

  const modelInstances = useAllModeInstances(modelCreated ? false : true);

  useEffect(() => {
    if (!modelInstances.isSuccess) return;

    const onlineModelInstances = modelInstances.data.filter(
      (e) => e.state === "STATE_ONLINE"
    );

    setModelInstanceOptions(
      onlineModelInstances.map((e) => {
        const instanceNameList = e.name.split("/");
        const modelId = instanceNameList[2];

        return {
          label: `${modelId}/${e.id}`,
          value: e.id,
        };
      })
    );
  }, [modelInstances.isSuccess]);

  const selectedModelInstanceOption = useMemo(() => {
    if (!values.model.existing.id || !modelInstanceOptions) return null;

    return (
      modelInstanceOptions.find((e) => e.value === values.model.existing.id) ||
      null
    );
  }, [values.model.existing.id, modelInstanceOptions]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Setup existing model                                        #
  // #                                                                 #
  // ###################################################################

  const canUseExistingModel = useMemo(() => {
    if (!values.model.existing.id) {
      return false;
    }

    return true;
  }, [values.model.existing.id]);

  const handleUseModel = useCallback(() => {
    if (!values.model.existing.id || !modelInstances.isSuccess) return;
    setFieldValue("model.type", "existing");
    setStepNumber(stepNumber + 1);
  }, [values.model.existing.id, modelInstances.isSuccess]);

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing online model
      </h3>
      <SingleSelect
        name="model.existing.id"
        instanceId="existing-model-id"
        options={modelInstanceOptions ? modelInstanceOptions : []}
        value={selectedModelInstanceOption}
        error={errors.model?.existing?.id || null}
        additionalOnChangeCb={null}
        disabled={modelCreated ? true : false}
        readOnly={false}
        required={true}
        description={"Setup Guide"}
        label="Source type"
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
