"use client";

import * as React from "react";
import { Form } from "@instill-ai/design-system";

import { useInstillForm } from "../../../../lib/use-instill-form";
import { useUpdaterOnRightPanel } from "../../lib";
import { getGeneralComponentConfiguration } from "../../lib";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { GeneralNodeData } from "../../type";

const selector = (store: InstillStore) => ({
  entitySecrets: store.entitySecrets,
  focusErrorFieldPathOnRightPanel: store.focusErrorFieldPathOnRightPanel,
  updateFocusErrorFieldPathOnRightPanel:
    store.updateFocusErrorFieldPathOnRightPanel,
});

export const PipelineGeneralComponentFormOnRightPanel = ({
  nodeID,
  nodeData,
  disabledAll,
}: {
  nodeID: string;
  nodeData: GeneralNodeData;
  disabledAll?: boolean;
}) => {
  const {
    entitySecrets,
    focusErrorFieldPathOnRightPanel,
    updateFocusErrorFieldPathOnRightPanel,
  } = useInstillStore(useShallow(selector));

  const configuration = React.useMemo(() => {
    return getGeneralComponentConfiguration(nodeData);
  }, [nodeData]);

  const { form, fields, ValidatorSchema } = useInstillForm(
    nodeData.definition?.spec.componentSpecification ?? null,
    configuration,
    {
      disabledAll,
      chooseTitleFrom: "title",
      enableSmartHint: true,
      componentID: nodeID,
      secrets: entitySecrets,
      enabledCollapsibleFormGroup: true,
      collapsibleDefaultOpen: true,
    },
  );

  const { setFocus } = form;

  React.useEffect(() => {
    if (focusErrorFieldPathOnRightPanel) {
      setTimeout(() => {
        setFocus(focusErrorFieldPathOnRightPanel);
        updateFocusErrorFieldPathOnRightPanel(() => null);
      }, 200);
    }
  }, [focusErrorFieldPathOnRightPanel, setFocus]);

  useUpdaterOnRightPanel({
    form,
    ValidatorSchema,
    currentNodeData: nodeData,
    nodeID,
  });

  return (
    <Form.Root {...form}>
      <form className="w-full">
        <div className="mb-10 flex w-full flex-col space-y-5">{fields}</div>
      </form>
    </Form.Root>
  );
};
