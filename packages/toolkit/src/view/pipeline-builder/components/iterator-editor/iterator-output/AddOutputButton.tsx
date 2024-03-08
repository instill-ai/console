import { Node } from "reactflow";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { IteratorNodeData } from "../../../type";
import { generateUniqueIndex } from "../../../lib";
import { Button } from "@instill-ai/design-system";
import { isIteratorComponent } from "../../../lib/checkComponentType";

const selector = (store: InstillStore) => ({
  editingIteratorID: store.editingIteratorID,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
});

export const AddOutputButton = ({
  targetIteratorNode,
}: {
  targetIteratorNode: Nullable<Node<IteratorNodeData>>;
}) => {
  const { editingIteratorID, updateTempSavedNodesForEditingIteratorFlow } =
    useInstillStore(useShallow(selector));

  return (
    <div className="flex">
      <Button
        onClick={() => {
          let newOutputElements = {};

          if (!targetIteratorNode?.data.iterator_component.output_elements) {
            newOutputElements = {
              result_0: "",
            };
          } else {
            // const newIdx = generateUniqueIndex(
            //   Object.entries(
            //     targetIteratorNode?.data.iterator_component.output_elements
            //   ).map(([key]) => key),
            //   "result_"
            // );

            const currentIndexArray = Object.keys(
              targetIteratorNode?.data.iterator_component.output_elements
            )
              .map((key) => key.replace("result_", ""))
              .map(Number)
              .sort((a, b) => b - a);

            newOutputElements = {
              ...targetIteratorNode?.data.iterator_component.output_elements,
              [`result_${currentIndexArray[0] + 1}`]: "",
            };
          }

          updateTempSavedNodesForEditingIteratorFlow((nodes) =>
            nodes.map((node) => {
              if (
                node.data.id === editingIteratorID &&
                isIteratorComponent(node.data)
              ) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    iterator_component: {
                      ...node.data.iterator_component,
                      output_elements: newOutputElements,
                    },
                  },
                };
              }

              return node;
            })
          );
        }}
        variant="secondaryGrey"
        size="sm"
      >
        Add Result
      </Button>
    </div>
  );
};
