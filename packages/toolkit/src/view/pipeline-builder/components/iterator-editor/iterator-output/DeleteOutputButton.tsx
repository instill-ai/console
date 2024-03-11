import { Button, Icons } from "@instill-ai/design-system";
import { InstillStore, useInstillStore, useShallow } from "../../../../../lib";
import { isIteratorComponent } from "../../../lib/checkComponentType";

const selector = (store: InstillStore) => ({
  editingIteratorID: store.editingIteratorID,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
});

export const DeleteOutputButton = ({ outputKey }: { outputKey: string }) => {
  const { editingIteratorID, updateTempSavedNodesForEditingIteratorFlow } =
    useInstillStore(useShallow(selector));

  return (
    <Button
      variant="tertiaryGrey"
      className="!p-2"
      onClick={() => {
        updateTempSavedNodesForEditingIteratorFlow((nodes) =>
          nodes.map((node) => {
            if (
              node.data.id === editingIteratorID &&
              isIteratorComponent(node.data)
            ) {
              delete node.data.iterator_component.output_elements[outputKey];

              return {
                ...node,
                data: {
                  ...node.data,
                  iterator_component: {
                    ...node.data.iterator_component,
                    output_elements: {
                      ...node.data.iterator_component.output_elements,
                    },
                  },
                },
              };
            }

            return node;
          })
        );
      }}
    >
      <Icons.Trash03 className="h-4 w-4 stroke-semantic-error-default" />
    </Button>
  );
};
