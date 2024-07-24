"use client";

import * as React from "react";

import { Form } from "@instill-ai/design-system";

import { useInstillStore } from "../../../../lib";
import { useInstillForm } from "../../../../lib/use-instill-form";
import { useCheckIsHidden, useUpdaterOnRightPanel } from "../../lib";
import { GeneralNodeData } from "../../type";

export const PipelineGeneralComponentFormOnRightPanel = ({
  nodeID,
  nodeData,
  disabledAll,
}: {
  nodeID: string;
  nodeData: GeneralNodeData;
  disabledAll?: boolean;
}) => {
  const checkIsHidden = useCheckIsHidden("onRightPanel");
  const entitySecrets = useInstillStore((store) => store.entitySecrets);

  const configuration = React.useMemo(() => {
    return {
      input: nodeData.input,
      condition: nodeData.condition,
      task: nodeData.task,
      setup: nodeData.setup,
    };
  }, [nodeData]);

  const { form, fields, ValidatorSchema } = useInstillForm(
    nodeData.definition?.spec.componentSpecification ?? null,
    configuration,
    {
      disabledAll,
      chooseTitleFrom: "title",
      checkIsHidden,
      enableSmartHint: true,
      componentID: nodeID,
      secrets: entitySecrets,
      enabledCollapsibleFormGroup: true,
      collapsibleDefaultOpen: true,
    },
  );

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
