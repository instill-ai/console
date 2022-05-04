import { PrimaryButton } from "@/components/ui/Buttons";
import useOnScreen from "@/hooks/useOnScreen";
import { SingleSelectOption } from "@instill-ai/design-system";
import { useFormikContext } from "formik";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { SingleSelect, TextField } from "../../FormikField";
import { mockAsyncDataConnectionOptions } from "../../MockData";
import { StepNumberState, Values } from "../CreatePipelineForm";

export type CreateNewSourceFlowProps = StepNumberState;

const CreateNewSourceFlow: FC<CreateNewSourceFlowProps> = ({
  maximumStepNumber,
  stepNumber,
  setStepNumber,
}) => {
  const [sourceOptions, setSourceOptions] = useState<
    SingleSelectOption[] | null
  >(null);

  const { values } = useFormikContext<Values>();

  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);

  useEffect(() => {
    if (!flowIsOnScreen) return;

    setTimeout(() => setSourceOptions(mockAsyncDataConnectionOptions), 3000);
  }, [flowIsOnScreen]);

  const canSetupNewSource = useMemo(() => {
    if (!values.dataSource.new.name || !values.dataSource.new.type)
      return false;

    return true;
  }, [values.dataSource.new.name, values.dataSource.new.type]);

  const handleSetupNewSource = () => {
    setStepNumber(stepNumber + 1);
  };

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">Setup a new source</h3>
      <TextField
        name="dataSource.new.name"
        label="Name"
        description="Pick a name to help you identify this source in Instill"
        disabled={false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
      />
      <SingleSelect
        name="dataSource.new.type"
        instanceId="new-data-source-type"
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
        disabled={canSetupNewSource ? false : true}
        onClickHandler={handleSetupNewSource}
      >
        Set up source
      </PrimaryButton>
    </div>
  );
};

export default CreateNewSourceFlow;
