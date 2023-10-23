import * as z from "zod";
import { Button, Form } from "@instill-ai/design-system";
import { ConnectorDefinition, GeneralRecord } from "../../lib";
import { useInstillForm } from "../../lib/use-instill-form";
import {
  PipelineBuilderStore,
  PipelineComponentReference,
  composeEdgesFromReferences,
  extractReferencesFromConfiguration,
  recursiveReplaceNullAndEmptyStringWithUndefined,
  usePipelineBuilderStore,
} from "../pipeline-builder";
import { shallow } from "zustand/shallow";

export type AIAutoFormProps = {
  disabledAll?: boolean;
  connectorDefinition: ConnectorDefinition;
  configuration: GeneralRecord;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: state.updateSelectedConnectorNodeId,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
});

export const AIAutoForm = (props: AIAutoFormProps) => {
  const { configuration, connectorDefinition } = props;

  const { form, fields, ValidatorSchema } = useInstillForm({
    schema: connectorDefinition.spec.component_specification,
    data: configuration,
  });

  const {
    nodes,
    updateNodes,
    updateEdges,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    updatePipelineRecipeIsDirty,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  function onSubmit(data: z.infer<typeof ValidatorSchema>) {
    if (!selectedConnectorNodeId) return;
    const modifiedData = recursiveReplaceNullAndEmptyStringWithUndefined(data);

    const newNodes = nodes.map((node) => {
      if (
        node.id === selectedConnectorNodeId &&
        node.data.nodeType === "connector"
      ) {
        return {
          ...node,
          data: {
            ...node.data,
            component: {
              ...node.data.component,
              configuration: {
                ...modifiedData,
                connector_definition_name: undefined,
              },
            },
          },
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: PipelineComponentReference[] = [];

    newNodes.forEach((node) => {
      if (node.data.component?.configuration) {
        allReferences.push(
          ...extractReferencesFromConfiguration(
            node.data.component?.configuration,
            node.id
          )
        );
      }
    });

    const newEdges = composeEdgesFromReferences(allReferences, newNodes);

    updateEdges(() => newEdges);
    updateSelectedConnectorNodeId(() => null);
    updatePipelineRecipeIsDirty(() => true);
  }

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
