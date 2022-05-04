import { PrimaryButton } from "@/components/ui/Buttons";
import {
  AsyncIcon,
  SingleSelectOption,
  SyncIcon,
} from "@instill-ai/design-system";
import { useFormikContext } from "formik";
import { FC, useMemo } from "react";
import { SingleSelect } from "../../FormikField";
import { FormikStep } from "../../FormikMultiStep";
import { syncDataConnectionOptions } from "../../MockData";
import { StepNumberState, Values } from "../CreatePipelineForm";

export type SetupSourceStepProps = StepNumberState;

const SetupPipelineModeStep: FC<SetupSourceStepProps> = ({
  stepNumber,
  setStepNumber,
}) => {
  const modeOptions = [
    {
      label: "Sync",
      value: "sync",
      startIcon: (
        <SyncIcon
          color="fill-instillGrey90"
          position=""
          width="w-[30px]"
          height="h-[30px]"
        />
      ),
    },
    {
      label: "Async",
      value: "async",
      startIcon: (
        <AsyncIcon
          color="fill-instillGrey90"
          position=""
          width="w-[30px]"
          height="h-[30px]"
        />
      ),
    },
  ];

  const { values, setFieldValue } = useFormikContext<Values>();

  const canGoNext = useMemo(() => {
    if (!values.pipeline.mode) return false;
    return true;
  }, [values.pipeline.mode]);

  const handleGoNext = () => {
    if (values.pipeline.mode === "sync") {
      setStepNumber(stepNumber + 2);
      return;
    }
    setStepNumber(stepNumber + 1);
  };

  const sourceTypeOnChangeCb = (option: SingleSelectOption) => {
    setFieldValue("dataSource.existing.name", option.value);
  };

  return (
    <FormikStep>
      <div className="mb-5 flex flex-col gap-y-5">
        <SingleSelect
          name="pipeline.mode"
          instanceId="pipeline-mode"
          label="Pipeline mode"
          description={"Setup Guide"}
          disabled={false}
          readOnly={false}
          required={true}
          options={modeOptions}
        />
      </div>
      {values.pipeline.mode === "sync" ? (
        <SingleSelect
          name="dataSource.existing.type"
          instanceId="data-source-type"
          label="Source type"
          description={"Setup Guide"}
          disabled={false}
          readOnly={false}
          required={true}
          options={syncDataConnectionOptions}
          onChangeCb={sourceTypeOnChangeCb}
        />
      ) : null}
      <PrimaryButton
        onClickHandler={handleGoNext}
        disabled={canGoNext ? false : true}
        type="button"
      >
        Next
      </PrimaryButton>
    </FormikStep>
  );
};

export default SetupPipelineModeStep;
