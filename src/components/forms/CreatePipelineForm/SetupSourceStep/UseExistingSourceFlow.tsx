import { PrimaryButton } from "@/components/ui/Buttons";
import useOnScreen from "@/hooks/useOnScreen";
import { SingleSelectOption } from "@instill-ai/design-system";
import { useFormikContext } from "formik";
import { FC, useState, useRef, useEffect, useMemo } from "react";
import { SingleSelect } from "../../FormikField";
import { StepNumberState, Values } from "../CreatePipelineForm";

export type UseExistingSourceFlowProps = StepNumberState;

const UseExistingSourceFlow: FC<UseExistingSourceFlowProps> = ({
  maximumStepNumber,
  setStepNumber,
  stepNumber,
}) => {
  const [sourceOptions, setSourceOptions] = useState<
    SingleSelectOption[] | null
  >(null);

  const { values } = useFormikContext<Values>();

  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);

  useEffect(() => {
    if (!flowIsOnScreen) return;

    setTimeout(() => setSourceOptions([]), 3000);
  }, [flowIsOnScreen]);

  const canUseExistingSource = useMemo(() => {
    if (!values.model.existing.name) {
      return false;
    }

    return true;
  }, [values.model.existing.name]);

  const handleUseExistingSource = () => {
    setStepNumber(stepNumber + 1);
  };

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing online source
      </h3>
      <SingleSelect
        name="model.existing.name"
        instanceId="existing-model-name"
        disabled={false}
        readOnly={false}
        options={sourceOptions ? sourceOptions : []}
        required={true}
        description={"Setup Guide"}
        label="Source type"
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={canUseExistingSource ? false : true}
        onClickHandler={handleUseExistingSource}
      >
        Use model
      </PrimaryButton>
    </div>
  );
};

export default UseExistingSourceFlow;
