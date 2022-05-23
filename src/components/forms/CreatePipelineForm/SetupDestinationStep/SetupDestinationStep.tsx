import { FC, useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { ConnectorIcon, FormVerticalDividers } from "@/components/ui";
import { PrimaryButton } from "@/components/ui/Buttons";
import { SingleSelect, FormikStep } from "../../../formik";
import { syncDataConnectionOptions } from "../../MockData";
import { StepNumberState, Values } from "../CreatePipelineForm";
import CreateNewDestinationFlow from "./CreateNewDestinationFlow";
import UseExistingDestinationFlow from "./UseExistingDestinationFlow";
import { useDestinationDefinitions } from "@/services/connector/DestinationServices";

export type SetupDestinationStepProps = StepNumberState;

const SetupDestinationStep: FC<SetupDestinationStepProps> = (props) => {
  const { values, setFieldValue } = useFormikContext<Values>();
  const destinationDefinition = useDestinationDefinitions();

  const destinationOptions: SingleSelectOption[] = useMemo(() => {
    if (!destinationDefinition.isSuccess) {
      return;
    }

    const syncDestinationDefinitions = destinationDefinition.data.filter(
      (e) =>
        e.connector_definition.connection_type === "CONNECTION_TYPE_DIRECTNESS"
    );

    return syncDestinationDefinitions.map((e) => {
      return {
        label: e.connector_definition.title,
        value: e.id,
        startIcon: (
          <ConnectorIcon
            type={e.connector_definition.title}
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      };
    });
  }, [
    values.destination.new.id,
    values.destination.existing.id,
    destinationDefinition.isSuccess,
  ]);

  // The source and destination type of sync mode will be the same, so we need to setup
  // source type and name here too.

  const dataDestinationOnChangeCb = (option: SingleSelectOption) => {
    setFieldValue("dataDestination.existing.name", option.value);
    setFieldValue("dataSource.existing.name", option.value);
    setFieldValue("dataSource.existing.type", option.value);
  };

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <FormikStep>
      {values.pipeline.mode === "MODE_SYNC" ? (
        <div className="flex flex-col gap-y-5">
          <SingleSelect
            name="dataDestination.existing.type"
            instanceId="data-destination-source"
            label="Destination type"
            description="With the selection of Sync type for the Pipeline, the destination will be same as the source."
            disabled={false}
            readOnly={false}
            options={destinationOptions}
            defaultValue={sourceOption ? sourceOption : null}
            required={true}
            onChangeCb={dataDestinationOnChangeCb}
            menuPlacement="auto"
          />
          <PrimaryButton
            position="ml-auto"
            disabled={false}
            onClickHandler={() => props.setStepNumber(props.stepNumber + 1)}
          >
            Next
          </PrimaryButton>
        </div>
      ) : (
        <div className="flex flex-1 flex-row">
          <UseExistingDestinationFlow {...props} />
          <FormVerticalDividers />
          <CreateNewDestinationFlow {...props} />
        </div>
      )}
    </FormikStep>
  );
};

export default SetupDestinationStep;
