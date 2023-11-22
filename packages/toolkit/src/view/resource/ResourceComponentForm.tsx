import { Button, Form } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  GeneralRecord,
  OperatorDefinition,
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
  const { form, fields, formTree } = useInstillForm(
    definition.spec.component_specification,
    configuration,
    {
      disabledAll,
      chooseTitleFrom: "key",
      checkIsHidden,
      enableSmartHint: true,
      componentID,
    }
  );

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex w-full flex-col space-y-5">{fields}</div>
        <div className="flex w-full flex-row-reverse gap-x-4">
          <Button
            type="submit"
            variant="secondaryColour"
            size="lg"
            className="gap-x-2"
          >
            Save
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
