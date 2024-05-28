"use client";

import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import { NodeProps } from "reactflow";
import { Button, Icons } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";
import { arrayMove } from "@dnd-kit/sortable";

import {
  InstillStore,
  Nullable,
  PipelineOutputField,
  useInstillStore,
} from "../../../../../lib";
import { UserDefinedFieldItem } from "./UserDefinedFieldItem";
import { VerticalSortableWrapper } from "../../VerticalSortableWrapper";
import { ComponentOutputs } from "../../ComponentOutputs";
import { NodeHead, NodeSortableFieldWrapper, NodeWrapper } from "../common";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponseNodeData } from "../../../type";
import { composeEdgesFromNodes, isResponseNode } from "../../../lib";
import {
  ResponseNodeFreeForm,
  ResponseNodeFreeFormSchema,
} from "./ResponseNodeFreeForm";
import { TriggerResponseNodeControlPanel } from "../control-panel";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  pipelineOpenAPIOutputSchema: store.pipelineOpenAPIOutputSchema,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
  isTriggeringPipeline: store.isTriggeringPipeline,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  collapseAllNodes: store.collapseAllNodes,
});

export type EndOperatorNodeFieldItem = {
  key: string;
  value: string;
  title: string;
};

export type PipelineResponseNodeFieldSortedItem = PipelineOutputField & {
  key: string;
};

export const ResponseNode = ({ data, id }: NodeProps<ResponseNodeData>) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [currentEditingFieldKey, setCurrentEditingFieldKey] =
    React.useState<Nullable<string>>(null);
  const [noteIsOpen, setNoteIsOpen] = React.useState<boolean>(false);
  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [isViewResultMode, setIsViewResultMode] = React.useState(false);

  const {
    nodes,
    updateNodes,
    updateEdges,
    pipelineOpenAPIOutputSchema,
    updatePipelineRecipeIsDirty,
    isOwner,
    currentVersion,
    isTriggeringPipeline,
    pipelineIsReadOnly,
    collapseAllNodes,
  } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    setNodeIsCollapsed(collapseAllNodes);
  }, [collapseAllNodes]);

  const form = useForm<z.infer<typeof ResponseNodeFreeFormSchema>>({
    resolver: zodResolver(ResponseNodeFreeFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onCreateFreeFormField = (
    formData: z.infer<typeof ResponseNodeFreeFormSchema>
  ) => {
    if (Object.keys(data.fields).includes(formData.key)) {
      if (isEditing) {
        if (formData.key !== currentEditingFieldKey) {
          form.setError("key", {
            type: "manual",
            message: "Key already exists",
          });
          return;
        }
      } else {
        form.setError("key", {
          type: "manual",
          message: "Key already exists",
        });
        return;
      }
    }

    const newNodes = nodes.map((node) => {
      if (isResponseNode(node)) {
        if (currentEditingFieldKey) {
          delete node.data.fields[currentEditingFieldKey];
        }

        // We need to put on the initial order, for example, if we have
        // 3 response fields, the instill_ui_order for new fields will be 3
        const currentFieldsCount = Object.keys(node.data.fields).length;

        node.data = {
          ...node.data,
          fields: {
            ...node.data.fields,
            [formData.key]: {
              title: formData.title,
              value: formData.value,
              instill_ui_order: currentFieldsCount,
            },
          },
        };
      }
      return node;
    });
    const newEdges = composeEdgesFromNodes(newNodes);
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
    setIsCreating(false);
    setIsEditing(false);
    setCurrentEditingFieldKey(null);
    form.reset({
      title: "",
      value: "",
      key: "",
    });
  };

  const onCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setCurrentEditingFieldKey(null);
    form.reset({
      title: "",
      key: "",
      value: "",
    });
  };

  function onDeleteField(key: string) {
    const newNodes = nodes.map((node) => {
      if (isResponseNode(node)) {
        delete node.data.fields[key];

        node.data = {
          ...node.data,
        };
      }
      return node;
    });
    const newEdges = composeEdgesFromNodes(newNodes);
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
  }

  function onEditField(key: string) {
    form.reset({
      title: data.fields[key].title,
      value: data.fields[key].value,
      key: key,
    });
    setIsEditing(true);
    setCurrentEditingFieldKey(key);
  }

  const [sortedItems, setSortedItems] = React.useState<
    PipelineResponseNodeFieldSortedItem[]
  >([]);

  React.useEffect(() => {
    const endOperatorInputItems = Object.entries(data.fields)
      .map(([key, value]) => {
        return {
          key,
          ...value,
        };
      })
      .sort((a, b) => {
        const aOrder = a.instill_ui_order;
        const bOrder = b.instill_ui_order;

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

  // Once isTriggeringPipeline is true, we will automatically go into
  // the view result mode.

  React.useEffect(() => {
    if (isTriggeringPipeline) {
      setIsViewResultMode(true);
    }
  }, [isTriggeringPipeline]);

  let disabledAddFieldButton = false;

  if (pipelineIsReadOnly) {
    disabledAddFieldButton = true;
  } else {
    if (!isOwner) {
      disabledAddFieldButton = true;
    } else {
      if (currentVersion !== "latest") {
        disabledAddFieldButton = true;
      }
    }
  }

  return (
    <NodeWrapper
      nodeID={id}
      nodeData={data}
      noteIsOpen={noteIsOpen}
      disabledSourceHandler={true}
    >
      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-2">
          <div className="my-auto flex h-6 w-6 rounded bg-semantic-bg-line">
            <Icons.Box className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
          </div>
          <p className="my-auto py-2 text-semantic-fg-secondary product-body-text-4-medium">
            response
          </p>
        </div>
        <div className="flex flex-row gap-x-3">
          {pipelineIsReadOnly ? null : (
            <button
              type="button"
              className="my-auto flex cursor-pointer rounded-full bg-semantic-accent-bg px-2 py-0.5 text-semantic-accent-default product-body-text-4-semibold hover:bg-semantic-accent-bg-alt"
              onClick={() => setIsViewResultMode(!isViewResultMode)}
            >
              {isViewResultMode ? "Edit" : "See Result"}
            </button>
          )}
          <TriggerResponseNodeControlPanel
            type="response"
            nodeIsCollapsed={nodeIsCollapsed}
            setNodeIsCollapsed={setNodeIsCollapsed}
            handleToggleNote={() => setNoteIsOpen(!noteIsOpen)}
            noteIsOpen={noteIsOpen}
          />
        </div>
      </NodeHead>

      {nodeIsCollapsed ? null : isEditing || isCreating ? (
        <ResponseNodeFreeForm
          form={form}
          onCreateFreeFormField={onCreateFreeFormField}
          onCancel={onCancel}
          isEditing={isEditing}
        />
      ) : isViewResultMode ? (
        <ComponentOutputs
          componentID={id}
          outputSchema={pipelineOpenAPIOutputSchema}
          nodeType="end"
          chooseTitleFrom="title"
        />
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
                  const newNodes = nodes.map((node) => {
                    if (isResponseNode(node)) {
                      const newFields = Object.fromEntries(
                        newSortedItems.map((item, index) => [
                          item.key,
                          {
                            title: item.title,
                            value: item.value,
                            instill_ui_order: index,
                          },
                        ])
                      );

                      node.data = {
                        ...node.data,
                        fields: newFields,
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
                <NodeSortableFieldWrapper key={item.key} path={item.key}>
                  <UserDefinedFieldItem
                    key={item.key}
                    fieldKey={item.key}
                    fieldTitle={item.title}
                    fieldValue={item.value}
                    onEditField={onEditField}
                    onDeleteField={onDeleteField}
                  />
                </NodeSortableFieldWrapper>
              ))}
            </div>
          </VerticalSortableWrapper>
          <Button
            className="flex w-full flex-1 gap-x-2"
            variant="tertiaryColour"
            onClick={() => setIsCreating(true)}
            disabled={disabledAddFieldButton}
            type="button"
          >
            <p className="my-auto pt-0.5">Add Field</p>
            <Icons.Plus
              className={cn(
                "my-auto h-4 w-4 stroke-semantic-accent-default",
                disabledAddFieldButton
                  ? "stroke-semantic-fg-secondary"
                  : "stroke-semantic-accent-default"
              )}
            />
          </Button>
        </div>
      )}
    </NodeWrapper>
  );
};
