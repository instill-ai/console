import * as React from "react";
import { Form } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  GeneralRecord,
  Nullable,
  OperatorDefinition,
  useDeepCompareEffect,
} from "../../lib";
import { CheckIsHidden, useInstillForm } from "../../lib/use-instill-form";

export type ResourceComponentFormProps = {
  disabledAll?: boolean;
  definition: ConnectorDefinition | OperatorDefinition;
  configuration: GeneralRecord;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onSubmit: (data: any) => void;
  checkIsHidden?: CheckIsHidden;
  componentID?: string;
};

export const ResourceComponentForm = ({
  configuration,
  definition,
  onSubmit,
  disabledAll,
  checkIsHidden,
  componentID,
}: ResourceComponentFormProps) => {
  const [tempConfiguration, setTempConfiguration] =
    React.useState<Nullable<GeneralRecord>>(null);

  const { form, fields, ValidatorSchema } = useInstillForm(
    definition.spec.component_specification,
    configuration,
    {
      disabledAll,
      chooseTitleFrom: "key",
      checkIsHidden,
      enableSmartHint: true,
      componentID,
      size: "sm",
    }
  );

  const { getValues, handleSubmit, trigger, watch } = form;

  const values = getValues();
  const watchValues = watch();

  // This will make sure that we have the latest values
  const upToDateValues = {
    ...watchValues,
    ...values,
  };

  // upToDateValues is a proxy object (it will be re-created every single time)
  // so we need to deep compare it to avoid endless loop
  useDeepCompareEffect(() => {
    setTempConfiguration(upToDateValues);
  }, [upToDateValues]);

  // Our useDeepCompareEffect can't structureClone ValidatorSchema, so
  // We have to use tempValues and additional useEffect to workaround this
  React.useEffect(() => {
    if (!tempConfiguration) {
      return;
    }

    const parsedResult = ValidatorSchema.safeParse(upToDateValues);

    // Instead of relying on isValid from react-hook-form, we will use our own
    // Validator to check whether the form is valid or not
    if (parsedResult.success) {
      handleSubmit(() => {
        onSubmit(tempConfiguration);
        setTempConfiguration(null);
      })();
    } else {
      console.log(parsedResult.error.errors);
      for (const error of parsedResult.error.errors) {
        trigger(error.path.join("."));
      }
    }
  }, [tempConfiguration, ValidatorSchema]);

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex w-full flex-col space-y-5">{fields}</div>
      </form>
    </Form.Root>
  );
};
