import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui/Buttons";
import useOnScreen from "@/hooks/useOnScreen";
import { SingleSelect } from "../../../formik";
import { StepNumberState, Values } from "../CreatePipelineForm";
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
  const { values, setFieldValue } = useFormikContext<Values>();
  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);

  // ###################################################################
  // #                                                                 #
  // # 1 - Get existing model instances.                               #
  // #                                                                 #
  // ###################################################################

  const [modelInstanceOptions, setModelInstanceOptions] =
    useState<Nullable<SingleSelectOption[]>>(null);

  const modelInstances = useAllModeInstances();

  useEffect(() => {
    if (!flowIsOnScreen || !modelInstances.isSuccess) return;

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
  }, [flowIsOnScreen, modelInstances.isSuccess]);

  const existingModelIdOption = useMemo(() => {
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

    setFieldValue(
      "model.existing.name",
      modelInstances.data.find((e) => e.id === values.model.existing.id)?.name
    );
    setFieldValue("model.type", "existing");
    setStepNumber(stepNumber + 1);
  }, [values.model.existing.id, modelInstances.isSuccess]);

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing online model
      </h3>
      <SingleSelect
        name="model.existing.id"
        instanceId="existing-model-id"
        disabled={modelCreated ? true : false}
        readOnly={false}
        options={modelInstanceOptions ? modelInstanceOptions : []}
        required={true}
        description={"Setup Guide"}
        label="Source type"
        menuPlacement="auto"
        value={existingModelIdOption}
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
