import cn from "clsx";
import * as React from "react";
import * as z from "zod";

import { Button, Icons } from "@instill-ai/design-system";
import { VerticalSortableWrapper } from "../VerticalSortableWrapper";
import { UserDefinedFieldItem } from "../nodes/response-node/UserDefinedFieldItem";
import { LeftSidebarCollapsible } from "./collapsible";
import { VariableSortableItemWrapper } from "./variable-sortable-item-wrapper";
import { useForm } from "react-hook-form";
import {
  ResponseNodeFreeForm,
  ResponseNodeFreeFormSchema,
} from "../nodes/response-node/ResponseNodeFreeForm";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { composeEdgesFromNodes, isResponseNode } from "../../lib";
import { ResponseNodeData } from "../../type";
import { Node } from "reactflow";
import {
  EndOperatorNodeFieldItem,
  PipelineResponseNodeFieldSortedItem,
} from "../nodes";
import { arrayMove } from "@dnd-kit/sortable";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export const OutputSection = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [currentEditingFieldKey, setCurrentEditingFieldKey] =
    React.useState<Nullable<string>>(null);
  const { nodes, updateNodes, updateEdges, updatePipelineRecipeIsDirty } =
    useInstillStore(useShallow(selector));

  const form = useForm<z.infer<typeof ResponseNodeFreeFormSchema>>({
    resolver: zodResolver(ResponseNodeFreeFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const outputFieldsMap = React.useMemo(() => {
    const triggerNode = nodes.find((node) => isResponseNode(node)) as
      | Node<ResponseNodeData>
      | undefined;

    return triggerNode?.data.fields ?? null;
  }, [nodes]);

  const onCreateFreeFormField = (
    formData: z.infer<typeof ResponseNodeFreeFormSchema>
  ) => {
    if (!outputFieldsMap) return;

    if (Object.keys(outputFieldsMap).includes(formData.key)) {
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
              instillUiOrder: currentFieldsCount,
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
    if (!outputFieldsMap) return;

    form.reset({
      title: outputFieldsMap[key].title,
      value: outputFieldsMap[key].value,
      key: key,
    });
    setIsEditing(true);
    setCurrentEditingFieldKey(key);
  }

  const [sortedItems, setSortedItems] = React.useState<
    PipelineResponseNodeFieldSortedItem[]
  >([]);

  React.useEffect(() => {
    if (!outputFieldsMap) return;

    const endOperatorInputItems = Object.entries(outputFieldsMap)
      .map(([key, value]) => {
        return {
          key,
          ...value,
        };
      })
      .sort((a, b) => {
        const aOrder = a.instillUiOrder;
        const bOrder = b.instillUiOrder;

        if (typeof aOrder === "undefined") {
          return 1;
        }

        if (typeof bOrder === "undefined") {
          return -1;
        }

        return aOrder > bOrder ? 1 : -1;
      });

    setSortedItems(endOperatorInputItems);
  }, [outputFieldsMap]);

  return (
    <LeftSidebarCollapsible title="Output">
      {isCreating || isEditing ? (
        <ResponseNodeFreeForm
          form={form}
          onCreateFreeFormField={onCreateFreeFormField}
          onCancel={onCancel}
          isEditing={isEditing}
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
                            instillUiOrder: index,
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
                <VariableSortableItemWrapper key={item.key} path={item.key}>
                  <UserDefinedFieldItem
                    key={item.key}
                    fieldKey={item.key}
                    fieldTitle={item.title}
                    fieldValue={item.value}
                    onEditField={onEditField}
                    onDeleteField={onDeleteField}
                  />
                </VariableSortableItemWrapper>
              ))}
            </div>
          </VerticalSortableWrapper>
          <Button
            className="flex w-full flex-1 gap-x-2"
            variant="tertiaryColour"
            onClick={() => setIsCreating(true)}
            type="button"
          >
            <p className="my-auto pt-0.5">Add Field</p>
            <Icons.Plus
              className={cn("my-auto h-4 w-4 stroke-semantic-accent-default")}
            />
          </Button>
        </div>
      )}
    </LeftSidebarCollapsible>
  );
};
