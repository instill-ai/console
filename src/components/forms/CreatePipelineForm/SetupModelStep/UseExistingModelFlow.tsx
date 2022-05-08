import { PrimaryButton } from "@/components/ui/Buttons";
import useOnScreen from "@/hooks/useOnScreen";
import { SingleSelectOption } from "@instill-ai/design-system";
import { useFormikContext } from "formik";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { SingleSelect } from "../../../formik/FormikField";
import { StepNumberState, Values } from "../CreatePipelineForm";

export type UseExistingModelFlowProps = StepNumberState;

const UseExistingModelFlow: FC<UseExistingModelFlowProps> = () => {
  const [modelOptions, setModelOptions] = useState<SingleSelectOption[] | null>(
    null
  );

  const { values } = useFormikContext<Values>();

  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);

  useEffect(() => {
    if (!flowIsOnScreen) return;

    setTimeout(() => setModelOptions([]), 3000);
  }, [flowIsOnScreen]);

  const canUseExistingModel = useMemo(() => {
    if (!values.model.existing.name) {
      return false;
    }

    return true;
  }, [values.model.existing.name]);

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing online model
      </h3>
      <SingleSelect
        name="model.existing.name"
        instanceId="existing-model-name"
        disabled={false}
        readOnly={false}
        options={modelOptions ? modelOptions : []}
        required={true}
        description={"Setup Guide"}
        label="Source type"
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={canUseExistingModel ? false : true}
      >
        Use model
      </PrimaryButton>
    </div>
  );
};

export default UseExistingModelFlow;
