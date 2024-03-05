import { Form } from "@instill-ai/design-system";

import { useInstillForm } from "../../../../lib/use-instill-form";
import { useCheckIsHidden, useUpdaterOnRightPanel } from "../../lib";
import { ConnectorNodeData, OperatorNodeData } from "../../type";
import { isConnectorComponent } from "../../lib/checkComponentType";
import { getConnectorOperatorComponentConfiguration } from "../../lib";

export const ComponentFormOnRightPanel = ({
  nodeData,
  disabledAll,
}: {
  nodeData: ConnectorNodeData | OperatorNodeData;
  disabledAll?: boolean;
}) => {
  const checkIsHidden = useCheckIsHidden("onRightPanel");

  const configuration = getConnectorOperatorComponentConfiguration(nodeData);

  const { form, fields, ValidatorSchema } = useInstillForm(
    isConnectorComponent(nodeData)
      ? nodeData.connector_component.definition
      : nodeData.operator_component.definition,
    configuration,
    {
      disabledAll,
      chooseTitleFrom: "key",
      checkIsHidden,
      enableSmartHint: true,
      componentID: nodeData.id,
    }
  );

  useUpdaterOnRightPanel({
    form,
    ValidatorSchema,
    currentNodeData: nodeData,
  });

  return (
    <Form.Root {...form}>
      <form className="w-full">
        <div className="mb-10 flex w-full flex-col space-y-5">{fields}</div>
      </form>
    </Form.Root>
  );
};
