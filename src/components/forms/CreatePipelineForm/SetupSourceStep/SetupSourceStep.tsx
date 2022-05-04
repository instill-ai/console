import { PrimaryButton } from "@/components/ui/Buttons";
import {
  AsyncIcon,
  AwsRdsIcon,
  GrpcIcon,
  HttpIcon,
  MySqlIcon,
  SingleSelectOption,
  SyncIcon,
} from "@instill-ai/design-system";
import { useFormikContext } from "formik";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { SingleSelect } from "../../FormikField";
import { FormikStep } from "../../FormikMultiStep";
import { Values } from "../CreatePipelineDataSourceForm/CreatePipelineDataSourceForm";

export type SetupSourceStepProps = {
  stepNumber: number;
  setStepNumber: Dispatch<SetStateAction<number>>;
};

const SetupSourceStep: FC<SetupSourceStepProps> = ({
  stepNumber,
  setStepNumber,
}) => {
  const syncSourceOptions = [
    {
      label: "http",
      value: "http",
      startIcon: (
        <HttpIcon
          width="w-[30px]"
          height="h-[30px]"
          color="fill-instillGrey90"
          position="my-auto"
        />
      ),
    },
    {
      label: "gRPC",
      value: "grpx",
      startIcon: (
        <GrpcIcon
          width="w-[30px]"
          height="h-[30px]"
          color="fill-instillGrey90"
          position="my-auto"
        />
      ),
    },
  ];

  const [sourceOptions, setSourceOptions] =
    useState<SingleSelectOption[]>(syncSourceOptions);
  const { values, isValid } = useFormikContext<Values>();

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

  useEffect(() => {
    if (values.pipeline.mode === "async") {
      setSourceOptions([
        {
          label: "AWS RES",
          value: "aws-rds",
          startIcon: (
            <AwsRdsIcon width="w-[30px]" height="h-[30px]" position="my-auto" />
          ),
        },
        {
          label: "MySQL",
          value: "mysql",
          startIcon: (
            <MySqlIcon width="w-[30px]" height="h-[30px]" position="my-auto" />
          ),
        },
      ]);
    }
  }, [values.pipeline.mode]);

  return (
    <FormikStep
      onSubmit={() => {
        setStepNumber(stepNumber + 1);
      }}
    >
      <div className="mb-5">
        <SingleSelect
          name="pipeline.mode"
          instanceId="datasource-mode"
          label="Pipeline type"
          description={"Setup Guide"}
          disabled={false}
          readOnly={false}
          required={true}
          options={modeOptions}
          defaultValue={modeOptions[0]}
        />
      </div>
      <div>
        <SingleSelect
          name="dataSource.source"
          instanceId="datasource-source"
          label="Source type"
          description={"Setup Guide"}
          disabled={false}
          readOnly={false}
          options={sourceOptions}
          required={true}
        />
      </div>
      <PrimaryButton disabled={!isValid} type="submit">
        Next
      </PrimaryButton>
    </FormikStep>
  );
};

export default SetupSourceStep;
