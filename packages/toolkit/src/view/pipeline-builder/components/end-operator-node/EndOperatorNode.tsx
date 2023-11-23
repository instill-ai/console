import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import { NodeProps, Position } from "reactflow";
import { Button, Form, Icons } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";
import { arrayMove } from "@dnd-kit/sortable";

import { EndNodeData, PipelineComponentReference } from "../../type";
import {
  extractReferencesFromConfiguration,
  composeEdgesFromReferences,
} from "../../lib";
import { CustomHandle } from "../CustomHandle";
import {
  InstillJSONSchema,
  InstillStore,
  Nullable,
  StartOperatorMetadata,
  useComponentOutputFields,
  useInstillForm,
  useInstillStore,
} from "../../../../lib";
import { UserDefinedFieldItem } from "./UserDefinedFieldItem";
import { VerticalSortableWrapper } from "../VerticalSortableWrapper";
import { NodeWrapper } from "../NodeWrapper";
import { NodeHead } from "../NodeHead";
import { SortableFieldWrapper } from "../SortableFieldWrapper";
import { StartEndOperatorControlPanel } from "../control-panel";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  edges: store.edges,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  testModeEnabled: store.testModeEnabled,
  testModeTriggerResponse: store.testModeTriggerResponse,
  pipelineOpenAPIOutputSchema: store.pipelineOpenAPIOutputSchema,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

const CreateEndOperatorInputSchema: InstillJSONSchema = {
  title: "End node operator intput schema",
  type: "object",
  required: ["title", "key", "value"],
  properties: {
    title: {
      instillAcceptFormats: ["string"],
      anyOf: [
        {
          type: "string",
          instillUpstreamType: "value",
        },
      ],
      instillUpstreamTypes: ["value"],
      title: "Title",
    },
    key: {
      instillAcceptFormats: ["string"],
      anyOf: [
        {
          type: "string",
          instillUpstreamType: "value",
          pattern: "^[a-z_][a-z_0-9]{0,31}$",
          instillPatternErrorMessage:
            "The component ID should be lowercase without any space or special character besides the underscore, and should be less than 32 characters.",
        },
      ],
      instillUpstreamTypes: ["value"],
      title: "Key",
    },
    value: {
      instillAcceptFormats: ["*/*"],
      anyOf: [
        {
          instillUpstreamType: "value",
          type: "string",
          maximum: 2048,
        },
        {
          instillUpstreamType: "reference",
          pattern: "^\\{.*\\}$",
          type: "string",
        },
        {
          instillUpstreamType: "template",
          type: "string",
        },
      ],
      instillUiMultiline: true,
      instillUpstreamTypes: ["value", "reference", "template"],
      title: "Value",
    },
  },
};

export type EndOperatorNodeFieldItem = {
  key: string;
  value: string;
  title: string;
};

export const EndOperatorNode = ({ data, id }: NodeProps<EndNodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);
  const [noteIsOpen, setNoteIsOpen] = React.useState<boolean>(false);
  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);

  const {
    nodes,
    edges,
    updateNodes,
    updateEdges,
    testModeEnabled,
    testModeTriggerResponse,
    pipelineOpenAPIOutputSchema,
    updatePipelineRecipeIsDirty,
    isOwner,
    currentVersion,
  } = useInstillStore(useShallow(selector));

  const { form, fields, ValidatorSchema } = useInstillForm(
    CreateEndOperatorInputSchema,
    null,
    {
      enableSmartHint: true,
      chooseTitleFrom: "title",
      componentID: data.component.id,
    }
  );

  const onSubmit = (formData: z.infer<typeof ValidatorSchema>) => {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "end") {
        if (prevFieldKey) {
          delete node.data.component.configuration.metadata[prevFieldKey];
          delete node.data.component.configuration.input[prevFieldKey];
        }

        node.data = {
          ...node.data,
          component: {
            ...node.data.component,
            configuration: {
              ...node.data.component.configuration,
              metadata: {
                ...node.data.component.configuration.metadata,
                [formData.key]: {
                  title: formData.title,
                },
              },
              input: {
                ...node.data.component.configuration.input,
                [formData.key]: formData.value,
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
    updatePipelineRecipeIsDirty(() => true);

    setEnableEdit(false);
    setPrevFieldKey(null);
    form.reset({
      title: "",
      value: "",
      key: "",
    });
  };

  function onDeleteField(key: string) {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "end") {
        delete node.data.component.configuration.metadata[key];
        delete node.data.component.configuration.input[key];

        node.data = {
          ...node.data,
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
    updatePipelineRecipeIsDirty(() => true);
  }

  function onEditField(key: string) {
    form.reset({
      title: data.component.configuration.metadata[key].title,
      value: data.component.configuration.input[key],
      key: key,
    });
    setEnableEdit(true);
    setPrevFieldKey(key);
  }

  const testModeOutputFields = useComponentOutputFields({
    schema: pipelineOpenAPIOutputSchema,
    data: testModeTriggerResponse?.outputs ?? null,
    nodeType: "end",
    chooseTitleFrom: "title",
  });

  const hasTargetEdges = React.useMemo(() => {
    return edges.some((edge) => edge.target === id);
  }, [edges, id]);

  const [sortedItems, setSortedItems] = React.useState<
    EndOperatorNodeFieldItem[]
  >([]);

  React.useEffect(() => {
    const endOperatorInputItems = Object.entries(
      data.component.configuration.input
    )
      .map(([key, value]) => {
        const title = data.component.configuration.metadata[key].title;

        return {
          key,
          value,
          title,
        };
      })
      .sort((a, b) => {
        const aOrder =
          data.component.configuration.metadata[a.key].instillUiOrder;
        const bOrder =
          data.component.configuration.metadata[b.key].instillUiOrder;

        if (typeof aOrder === "undefined") {
          return 1;
        }

        if (typeof bOrder === "undefined") {
          return -1;
        }

        return aOrder > bOrder ? 1 : -1;
      });

    setSortedItems(endOperatorInputItems);
  }, [data]);

  return (
    <NodeWrapper
      nodeType={data.nodeType}
      id={id}
      note={data.note}
      noteIsOpen={noteIsOpen}
    >
      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-2">
          <div className="my-auto flex h-6 w-6 rounded bg-semantic-bg-line">
            <Icons.Box className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
          </div>
          <p className="my-auto py-2 text-semantic-fg-secondary product-body-text-4-medium">
            end
          </p>
        </div>
        <StartEndOperatorControlPanel
          nodeIsCollapsed={nodeIsCollapsed}
          setNodeIsCollapsed={setNodeIsCollapsed}
          handleToggleNote={() => setNoteIsOpen(!noteIsOpen)}
          noteIsOpen={noteIsOpen}
          componentTypeName="End"
        />
      </NodeHead>

      {nodeIsCollapsed ? null : enableEdit ? (
        <Form.Root {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3 flex flex-row justify-between">
              <Button
                variant="tertiaryGrey"
                size="sm"
                className="!px-2 !py-2"
                type="button"
                onClick={() => {
                  setEnableEdit(!enableEdit);
                  setPrevFieldKey(null);
                  form.reset({
                    title: "",
                    key: "",
                    value: "",
                  });
                }}
              >
                <Icons.ArrowLeft className="m-auto h-4 w-4 stroke-semantic-fg-secondary" />
              </Button>
              <div>
                <Button variant="primary" type="submit" size="sm">
                  Save
                </Button>
              </div>
            </div>
            <div className="flex flex-col space-y-3">{fields}</div>
          </form>
        </Form.Root>
      ) : testModeEnabled ? (
        <div className="flex w-full flex-col gap-y-4">
          {testModeOutputFields}
        </div>
      ) : (
        <div className="flex flex-col">
          <VerticalSortableWrapper
            items={sortedItems}
            onDragEnd={(event) => {
              const { active, over } = event;

              if (over && active.id !== over.id) {
                let newSortedItems: EndOperatorNodeFieldItem[] = [];

                setSortedItems((items) => {
                  const oldIndex = items.findIndex((e) => e.key === active.id);
                  const newIndex = items.findIndex((e) => e.key === over.id);

                  newSortedItems = arrayMove(items, oldIndex, newIndex);

                  return newSortedItems;
                });

                if (newSortedItems.length > 0) {
                  const newMetadata: Record<string, StartOperatorMetadata> = {};

                  newSortedItems.forEach((item, index) => {
                    newMetadata[item.key] = {
                      ...data.component.configuration.metadata[item.key],
                      instillUiOrder: index,
                    };
                  });

                  const newNodes = nodes.map((node) => {
                    if (node.data.nodeType === "end") {
                      node.data = {
                        ...node.data,
                        component: {
                          ...node.data.component,
                          configuration: {
                            ...node.data.component.configuration,
                            metadata: newMetadata,
                          },
                        },
                      };
                    }
                    return node;
                  });

                  updateNodes(() => newNodes);
                  updatePipelineRecipeIsDirty(() => true);
                }
              }
            }}
          >
            <div className="mb-4 flex flex-col gap-y-4">
              {sortedItems.map((item) => (
                <SortableFieldWrapper key={item.key} path={item.key}>
                  <UserDefinedFieldItem
                    key={item.key}
                    fieldKey={item.key}
                    fieldValue={item.value}
                    onEditField={onEditField}
                    onDeleteField={onDeleteField}
                  />
                </SortableFieldWrapper>
              ))}
            </div>
          </VerticalSortableWrapper>
          <Button
            className="flex w-full flex-1 gap-x-2"
            variant="tertiaryColour"
            onClick={() => setEnableEdit(!enableEdit)}
            disabled={
              isOwner ? (currentVersion === "latest" ? false : true) : true
            }
            type="button"
          >
            <p className="my-auto pt-0.5">Add Field</p>
            <Icons.Plus
              className={cn(
                "my-auto h-4 w-4 stroke-semantic-accent-default",
                currentVersion === "latest"
                  ? "stroke-semantic-accent-default"
                  : "stroke-semantic-fg-secondary"
              )}
            />
          </Button>
        </div>
      )}
      <CustomHandle
        className={hasTargetEdges ? "" : "!opacity-0"}
        type="target"
        position={Position.Left}
        id={id}
      />
    </NodeWrapper>
  );
};
