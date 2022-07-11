import { FC, useEffect, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import {
  AsyncIcon,
  SingleSelectOption,
  SyncIcon,
} from "@instill-ai/design-system";

import { SingleSelect, FormikStep } from "@/components/formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { PrimaryButton } from "@/components/ui";
import { useCreateSource, useSources } from "@/services/connector";
import ConnectorIcon from "@/components/ui/ConnectorIcon";
import { CreateSourcePayload } from "@/lib/instill";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type SetupSourceStepProps = StepNumberState;

const SetupPipelineModeStep: FC<SetupSourceStepProps> = ({
  stepNumber,
  setStepNumber,
}) => {
  const { values, setFieldValue, errors } =
    useFormikContext<CreatePipelineFormValues>();
  const { amplitudeIsInit } = useAmplitudeCtx();

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

  const selectedModeOption = useMemo(() => {
    if (!modeOptions || !values.pipeline.mode) return null;

    return modeOptions.find((e) => e.value === values.pipeline.mode) || null;
  }, [modeOptions, values.pipeline.mode]);

  const selectedSourceIdOption = useMemo(() => {
    if (!values.source.existing.id || !syncSourceOptions) return null;

    return (
      syncSourceOptions.find((e) => e.value === values.source.existing.id) ||
      null
    );
  }, [values.source.existing.id, syncSourceOptions]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Create target source.                                       #
  // #                                                                 #
  // ###################################################################

  const createSource = useCreateSource();
  const sources = useSources();

  const canGoNext = useMemo(() => {
    if (!values.pipeline.mode) return false;
    if (values.pipeline.mode === "MODE_SYNC" && !values.source.existing.id) {
      return false;
    }

    return true;
  }, [values.pipeline.mode, values.source.existing.id]);

  const handleGoNext = () => {
    if (!sources.isSuccess || !values.source.existing.id) return;

    if (values.pipeline.mode === "MODE_SYNC") {
      const sourceIndex = sources.data.findIndex(
        (e) => e.id === values.source.existing.id
      );

      if (sourceIndex !== -1) {
        if (amplitudeIsInit) {
          sendAmplitudeData("use_existing_source", {
            type: "critical_action",
            process: "pipeline",
          });
        }
        setFieldValue("source.type", "existing");
        setStepNumber(stepNumber + 2);
        return;
      }

      const payload: CreateSourcePayload = {
        id: values.source.existing.id,
        source_connector_definition: `source-connector-definitions/${values.source.existing.id}`,
        connector: {
          configuration: {},
        },
      };

      createSource.mutate(payload, {
        onSuccess: () => {
          if (amplitudeIsInit) {
            sendAmplitudeData("create_source", {
              type: "critical_action",
              process: "pipeline",
            });
          }
          setFieldValue("source.type", "existing");
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
          id="pipelineMode"
          name="pipeline.mode"
          label="Pipeline mode"
          description={"Setup Guide"}
          value={selectedModeOption}
          options={modeOptions}
          error={errors.pipeline?.mode || null}
          disabled={true}
          required={true}
        />
        {values.pipeline.mode === "MODE_SYNC" ? (
          <SingleSelect
            id="existingSourceId"
            name="source.existing.id"
            label="Source type"
            additionalMessageOnLabel={null}
            description={"Setup Guide"}
            value={selectedSourceIdOption}
            options={syncSourceOptions}
            additionalOnChangeCb={null}
            error={errors.source?.existing?.id || null}
            disabled={false}
            readOnly={false}
            required={true}
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
