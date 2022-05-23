import {
  Dispatch,
  FC,
  SetStateAction,
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

export type UseExistingModelFlowProps = StepNumberState & {
  setModelCreated: Dispatch<SetStateAction<boolean>>;
  modelCreated: boolean;
};

const UseExistingModelFlow: FC<UseExistingModelFlowProps> = ({
  setModelCreated,
  modelCreated,
}) => {
  const [modelInstanceOptions, setModelInstanceOptions] = useState<
    SingleSelectOption[] | null
  >(null);

  const { values } = useFormikContext<Values>();

  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);
  const modelInstances = useAllModeInstances();

  useEffect(() => {
    if (!flowIsOnScreen || !modelInstances.isSuccess) return;

    console.log(modelInstances);

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

  const canUseExistingModel = useMemo(() => {
    if (!values.model.existing.id) {
      return false;
    }

    return true;
  }, [values.model.existing.id]);

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing online model
      </h3>
      <SingleSelect
        name="model.existing.name"
        instanceId="existing-model-name"
        disabled={modelCreated ? true : false}
        readOnly={false}
        options={modelInstanceOptions ? modelInstanceOptions : []}
        required={true}
        description={"Setup Guide"}
        label="Source type"
        menuPlacement="auto"
        defaultValue={null}
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={modelCreated ? true : canUseExistingModel ? false : true}
      >
        Use model
      </PrimaryButton>
    </div>
  );
};

export default UseExistingModelFlow;
