import { FC, useState, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui/Buttons";
import { SingleSelect } from "../../../formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { useSources } from "@/services/connector";
import { ConnectorIcon } from "@/components/ui";
import { Nullable } from "@/types/general";

export type UseExistingSourceFlowProps = StepNumberState;

const UseExistingSourceFlow: FC<UseExistingSourceFlowProps> = ({
  setStepNumber,
  stepNumber,
}) => {
  const { values, setFieldValue, errors } =
    useFormikContext<CreatePipelineFormValues>();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the source definition and sources                #
  // #                                                                 #
  // ###################################################################

  const [sourceOptions, setSourceOptions] =
    useState<Nullable<SingleSelectOption[]>>(null);

  const sources = useSources();

  useEffect(() => {
    if (!sources.isSuccess || !sources.data) return;

    setSourceOptions(
      sources.data.map((e) => {
        return {
          label: e.id,
          value: e.id,
          startIcon: (
            <ConnectorIcon
              iconName={e.source_connector_definition.connector_definition.icon}
              iconColor="fill-instillGrey90"
              iconHeight="h-[30px]"
              iconWidth="w-[30px]"
              iconPosition="my-auto"
            />
          ),
        };
      })
    );
  }, [sources.isSuccess, sources.data]);

  const selectedSourceOption = useMemo(() => {
    if (!values.source.existing.id || !sourceOptions) return null;

    return (
      sourceOptions.find((e) => e.value === values.source.existing.id) || null
    );
  }, [values.source.existing.id, sourceOptions]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Use existing source                                         #
  // #                                                                 #
  // ###################################################################

  const canUseExistingSource = useMemo(() => {
    if (!values.source.existing.id) {
      return false;
    }

    return true;
  }, [values.source.existing.id]);

  const handleUseExistingSource = () => {
    const source = sources.data?.find(
      (e) => e.id === values.source.existing.id
    );

    if (!source) return;

    setFieldValue(
      "source.existing.definition",
      source.source_connector_definition.connector_definition.title
    );
    setStepNumber(stepNumber + 1);
  };

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing online source
      </h3>
      <SingleSelect
        name="source.existing.name"
        label="Source type"
        instanceId="existing-data-source-name"
        description={"Setup Guide"}
        options={sourceOptions ? sourceOptions : []}
        value={selectedSourceOption}
        error={errors.source?.existing?.id || null}
        additionalOnChangeCb={null}
        menuPlacement="auto"
        disabled={false}
        readOnly={false}
        required={true}
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={canUseExistingSource ? false : true}
        onClickHandler={handleUseExistingSource}
      >
        Use model
      </PrimaryButton>
    </div>
  );
};

export default UseExistingSourceFlow;
