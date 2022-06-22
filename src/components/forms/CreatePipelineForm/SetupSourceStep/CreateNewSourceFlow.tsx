import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui";
import { SingleSelect, TextField } from "../../../formik";
import { mockAsyncDataConnectionOptions } from "../../MockData";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { useCreateSource, useSources } from "@/services/connector";
import { CreateSourcePayload } from "@/lib/instill";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type CreateNewSourceFlowProps = StepNumberState;

const CreateNewSourceFlow: FC<CreateNewSourceFlowProps> = ({
  stepNumber,
  setStepNumber,
}) => {
  const { values, errors, setFieldValue } =
    useFormikContext<CreatePipelineFormValues>();
  const flowRef = useRef<HTMLDivElement>(null);
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the source definition and sources                #
  // #                                                                 #
  // ###################################################################

  const [sourceOptions, setSourceOptions] = useState<
    SingleSelectOption[] | null
  >(null);

  const sources = useSources();

  useEffect(() => {
    setSourceOptions(mockAsyncDataConnectionOptions);
  }, []);

  const canCreateNewSource = useMemo(() => {
    if (!values.source.new.id || !values.source.new.definition) return false;

    return true;
  }, [values.source.new.id, values.source.new.definition]);

  const selectedSourceOption = useMemo(() => {
    if (!values.source.new.definition || !sourceOptions) return null;

    return (
      sourceOptions.find((e) => e.value === values.source.new.definition) ||
      null
    );
  }, [values.source.new.definition, sourceOptions]);

  // ###################################################################
  // #                                                                 #
  // # 1 - Create new source                                           #
  // #                                                                 #
  // ###################################################################

  const createSource = useCreateSource();

  const handleCreateNewSource = () => {
    if (!canCreateNewSource || !values.source.new.id || !sources.isSuccess) {
      return;
    }

    const sourceIndex = sources.data.findIndex(
      (e) => e.id === values.source.existing.id
    );

    if (sourceIndex !== -1) {
      return;
    }

    const payload: CreateSourcePayload = {
      id: values.source.new.id,
      source_connector_definition: `source-connector-definitions/${values.source.existing.id}`,
      connector: {
        configuration: "{}",
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
        setFieldValue("source.type", "new");
        setStepNumber(stepNumber + 1);
      },
    });
  };

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="text-black text-instill-h3">Setup a new source</h3>
      <TextField
        id="sourceId"
        name="source.new.id"
        label="Name"
        description="Pick a name to help you identify this source in Instill"
        value={values.source.new.id}
        error={errors.source?.new?.id || null}
        additionalOnChangeCb={null}
        disabled={false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
      />
      <SingleSelect
        id="sourceDefinition"
        name="source.new.definition"
        label="Source type"
        description="Setup Guide"
        value={selectedSourceOption}
        options={sourceOptions ? sourceOptions : []}
        error={errors.source?.new?.definition || null}
        additionalOnChangeCb={null}
        menuPlacement="auto"
        disabled={false}
        readOnly={false}
        required={true}
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={canCreateNewSource ? false : true}
        onClickHandler={handleCreateNewSource}
      >
        Set up source
      </PrimaryButton>
    </div>
  );
};

export default CreateNewSourceFlow;
