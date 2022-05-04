import { FormVerticalDividers } from "@/components/ui";
import { SingleSelectOption } from "@instill-ai/design-system";
import { useFormikContext } from "formik";
import { FC, useMemo, useEffect } from "react";
import { SingleSelect } from "../../FormikField";
import { FormikStep } from "../../FormikMultiStep";
import { syncDataConnectionOptions } from "../../MockData";
import { StepNumberState, Values } from "../CreatePipelineForm";
import CreateNewDestinationFlow from "./CreateNewDestinationFlow";
import UseExistingDestinationFlow from "./UseExistingDestinationFlow";

export type SetupDestinationStepProps = StepNumberState;

const SetupDestinationStep: FC<SetupDestinationStepProps> = (props) => {
  const { values, setFieldValue } = useFormikContext<Values>();

  const sourceOption = useMemo(() => {
    if (!values.dataSource.new.name && !values.dataSource.existing.name) return;

    const sourceName =
      values.dataSource.new.name ?? values.dataSource.existing.name;

    const index = syncDataConnectionOptions.findIndex(
      (e) => e.value === sourceName
    );

    return syncDataConnectionOptions[index];
  }, [values.dataSource.new.name, values.dataSource.existing.name]);

  const dataDestinationOnChangeCb = (option: SingleSelectOption) => {
    setFieldValue("dataSource.name", option.value);
  };

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <FormikStep>
      <div className="flex flex-col gap-y-5">
        {values.pipeline.mode === "sync" ? (
          <>
            <SingleSelect
              name="dataDestination.name"
              instanceId="data-destination-source"
              label="Destination type"
              description={
                "With the selection of Sync type for the Pipeline, the destination will be same as the source."
              }
              disabled={false}
              readOnly={false}
              options={syncDataConnectionOptions}
              defaultValue={sourceOption ? sourceOption : undefined}
              required={true}
              onChangeCb={dataDestinationOnChangeCb}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-row">
            <UseExistingDestinationFlow {...props} />
            <FormVerticalDividers />
            <CreateNewDestinationFlow {...props} />
          </div>
        )}
      </div>
    </FormikStep>
  );
};

export default SetupDestinationStep;
