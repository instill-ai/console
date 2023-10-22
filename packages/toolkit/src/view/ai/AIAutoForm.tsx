import * as z from "zod";
import { Form } from "@instill-ai/design-system";
import { ConnectorDefinition, GeneralRecord } from "../../lib";
import { useInstillForm } from "../../lib/use-instill-form";

export type AIAutoFormProps = {
  disabledAll?: boolean;
  connectorDefinition: ConnectorDefinition;
  configuration: GeneralRecord;
};

export const AIAutoForm = (props: AIAutoFormProps) => {
  const { configuration, disabledAll, connectorDefinition } = props;

  const { form, fields, ValidatorSchema } = useInstillForm({
    schema: connectorDefinition.spec.component_specification,
    data: configuration,
  });

  function onSubmit(data: z.infer<typeof ValidatorSchema>) {
    console.log(data);
  }

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex w-full flex-col space-y-5">{fields}</div>
      </form>
    </Form.Root>
  );
};
