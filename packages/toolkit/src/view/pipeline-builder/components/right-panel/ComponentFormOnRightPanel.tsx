"use client";

import * as React from "react";
import { Form } from "@instill-ai/design-system";

import { useInstillForm } from "../../../../lib/use-instill-form";
import { useCheckIsHidden, useUpdaterOnRightPanel } from "../../lib";
import { ConnectorNodeData, OperatorNodeData } from "../../type";
import { isConnectorComponent } from "../../lib/checkComponentType";
import { getConnectorOperatorComponentConfiguration } from "../../lib";
import { useInstillStore } from "../../../../lib";

export const ComponentFormOnRightPanel = ({
  nodeData,
  disabledAll,
}: {
  nodeData: ConnectorNodeData | OperatorNodeData;
  disabledAll?: boolean;
}) => {
  const checkIsHidden = useCheckIsHidden("onRightPanel");
  const entitySecrets = useInstillStore((store) => store.entitySecrets);

  const definition = React.useMemo(() => {
    if (isConnectorComponent(nodeData)) {
      return nodeData.connector_component.definition;
    }
    return nodeData.operator_component.definition;
  }, [nodeData]);

  const configuration = React.useMemo(() => {
    return getConnectorOperatorComponentConfiguration(nodeData);
  }, [nodeData]);

  const { form, fields, ValidatorSchema } = useInstillForm(
    definition?.spec.component_specification ?? null,
    configuration,
    {
      disabledAll,
      chooseTitleFrom: "title",
      checkIsHidden,
      enableSmartHint: true,
      componentID: nodeData.id,
      secrets: entitySecrets,
      enabledCollapsibleFormGroup: true,
      collapsibleDefaultOpen: true,
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
