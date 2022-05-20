import { FC, useEffect, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import {
  AsyncIcon,
  SingleSelectOption,
  SyncIcon,
} from "@instill-ai/design-system";

import { SingleSelect, FormikStep } from "../../../formik";
import { StepNumberState, Values } from "../CreatePipelineForm";
import { PrimaryButton } from "@/components/ui/Buttons";
import {
  useCreateSource,
  useSourceDefinitions,
} from "@/services/connector/SourceServices";
import ConnectorIcon from "@/components/ui/ConnectorIcon";
import { CreateSourcePayload } from "@/lib/instill";

export type SetupSourceStepProps = StepNumberState;

const SetupPipelineModeStep: FC<SetupSourceStepProps> = ({
  stepNumber,
  setStepNumber,
}) => {
  const modeOptions = [
    {
      label: "Sync",
      value: "MODE_SYNC",
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
      value: "MODE_ASYNC",
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

  const sourceDefinitions = useSourceDefinitions();
  const { values, setFieldValue } = useFormikContext<Values>();

  const [syncConnectionOptions, setSyncConnectionOptions] = useState<
    SingleSelectOption[]
  >([]);

  useEffect(() => {
    if (!sourceDefinitions.isSuccess) return;

    console.log(sourceDefinitions);

    if (values.pipeline.mode === "MODE_SYNC") {
      const syncDefinitions = sourceDefinitions.data.filter(
        (e) =>
          e.connector_definition.connection_type ===
          "CONNECTION_TYPE_DIRECTNESS"
      );

      setSyncConnectionOptions(
        syncDefinitions.map((e) => {
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
        })
      );

      return;
    }

    const asyncDefinitions = sourceDefinitions.data.filter(
      (e) =>
        e.connector_definition.connection_type !== "CONNECTION_TYPE_DIRECTNESS"
    );

    setSyncConnectionOptions(
      asyncDefinitions.map((e) => {
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
      })
    );
  }, [sourceDefinitions.isSuccess, values.pipeline.mode]);

  const canGoNext = useMemo(() => {
    if (!values.pipeline.mode) return false;
    if (values.pipeline.mode === "MODE_SYNC" && !values.source.existing.id) {
      return false;
    }

    return true;
  }, [values.pipeline.mode, values.source.existing]);

  const createSource = useCreateSource();

  const handleGoNext = () => {
    if (values.pipeline.mode === "MODE_SYNC") {
      const payload: CreateSourcePayload = {
        id: values.source.existing.id,
        source_connector_definition: "source-connector-definitions/source-http",
        connector: {
          configuration: "{}",
        },
      };

      createSource.mutate(payload, {
        onSuccess: (newSource) => {
          setFieldValue("source.existing.name", newSource.name);
        },
      });

      setStepNumber(stepNumber + 2);
      return;
    }
    setStepNumber(stepNumber + 1);
  };

  // The source and destination type of sync mode will be the same, so we need to setup
  // destination type and name here too.
  const sourceTypeOnChangeCb = (option: SingleSelectOption) => {
    setFieldValue("dataSource.existing.name", option.value);
    setFieldValue("dataDestination.existing.name", option.value);
    setFieldValue("dataDestination.existing.type", option.value);
  };

  return (
    <FormikStep>
      <div className="mb-[60px] flex flex-col gap-y-5">
        <SingleSelect
          name="pipeline.mode"
          instanceId="pipeline-mode"
          label="Pipeline mode"
          description={"Setup Guide"}
          disabled={true}
          readOnly={false}
          required={true}
          options={modeOptions}
          defaultValue={modeOptions[0]}
        />
        {values.pipeline.mode === "MODE_SYNC" ? (
          <SingleSelect
            name="source.existing.id"
            instanceId="data-source-type"
            label="Source type"
            description={"Setup Guide"}
            disabled={false}
            readOnly={false}
            required={true}
            options={syncConnectionOptions}
            onChangeCb={sourceTypeOnChangeCb}
          />
        ) : null}
      </div>

      <PrimaryButton
        onClickHandler={handleGoNext}
        disabled={canGoNext ? false : true}
        type="button"
        position="ml-auto"
      >
        Next
      </PrimaryButton>
    </FormikStep>
  );
};

export default SetupPipelineModeStep;
