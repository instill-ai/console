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
  useSources,
} from "@/services/connector/SourceServices";
import ConnectorIcon from "@/components/ui/ConnectorIcon";
import { CreateSourcePayload } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type SetupSourceStepProps = StepNumberState;

const SetupPipelineModeStep: FC<SetupSourceStepProps> = ({
  stepNumber,
  setStepNumber,
}) => {
  const { values, setFieldValue } = useFormikContext<Values>();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the source definition and pipelines              #
  // #                                                                 #
  // ###################################################################

  const [modeOptions, setModeOptions] = useState<SingleSelectOption[]>([]);
  const [syncSourceOptions, setSyncSourceOptions] = useState<
    SingleSelectOption[]
  >([]);

  useEffect(() => {
    setModeOptions([
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
    ]);

    setSyncSourceOptions([
      {
        label: "gRPC",
        value: "source-grpc",
        startIcon: (
          <ConnectorIcon
            iconName="grpc.svg"
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      },
      {
        label: "HTTP",
        value: "source-http",
        startIcon: (
          <ConnectorIcon
            iconName="http.svg"
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      },
    ]);
  }, []);

  const sourceIdOption = useMemo(() => {
    if (!values.source.id) return null;

    return syncSourceOptions.find((e) => e.value === values.source.id) || null;
  }, [values.source.id]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Create target source.                                       #
  // #                                                                 #
  // ###################################################################

  const createSource = useCreateSource();
  const sources = useSources();

  const canGoNext = useMemo(() => {
    if (!values.pipeline.mode) return false;
    if (values.pipeline.mode === "MODE_SYNC" && !values.source.id) {
      return false;
    }

    return true;
  }, [values.pipeline.mode, values.source.id]);

  const handleGoNext = () => {
    if (!sources.isSuccess) return;

    if (values.pipeline.mode === "MODE_SYNC") {
      const sourceIndex = sources.data.findIndex(
        (e) => e.id === values.source.id
      );

      if (sourceIndex !== -1) {
        setStepNumber(stepNumber + 2);
        return;
      }

      const payload: CreateSourcePayload = {
        id: values.source.id,
        source_connector_definition: `source-connector-definitions/${values.source.id}`,
        connector: {
          configuration: "{}",
        },
      };

      createSource.mutate(payload, {
        onSuccess: (newSource) => {
          setFieldValue("source.existing.name", newSource.name);
          setStepNumber(stepNumber + 2);
        },
      });

      return;
    }
    setStepNumber(stepNumber + 1);
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
          value={modeOptions[0]}
          menuPlacement="auto"
        />
        {values.pipeline.mode === "MODE_SYNC" ? (
          <SingleSelect
            name="source.id"
            instanceId="data-source-id"
            label="Source type"
            description={"Setup Guide"}
            disabled={false}
            readOnly={false}
            required={true}
            options={syncSourceOptions}
            value={sourceIdOption}
            menuPlacement="auto"
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
