import { Form } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  GeneralRecord,
  OperatorDefinition,
} from "../../../lib";
import { useInstillForm } from "../../../lib/use-instill-form";
import { useCheckIsHidden } from "./useCheckIsHidden";
import { useUpdaterOnRightPanel } from "./useUpdaterOnRightPanel";

export type ResourceComponentFormProps = {
  componentID: string;
  disabledAll?: boolean;
  definition: ConnectorDefinition | OperatorDefinition;
  configuration: GeneralRecord;
  nodeType: "connector" | "operator";
};

export const ComponentFormOnRightPanel = ({
  configuration,
  definition,
  disabledAll,
  componentID,
  nodeType,
}: ResourceComponentFormProps) => {
  const checkIsHidden = useCheckIsHidden("onRightPanel");

  const { form, fields, ValidatorSchema, formTree } = useInstillForm(
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

  useUpdaterOnRightPanel({
    id: componentID,
    form,
    ValidatorSchema,
    nodeType,
  });

  return (
    <Form.Root {...form}>
      <form className="w-full">
        <div className="mb-10 flex w-full flex-col space-y-5">{fields}</div>
      </form>
    </Form.Root>
  );
};
