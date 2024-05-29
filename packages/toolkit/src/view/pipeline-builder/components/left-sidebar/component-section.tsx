import * as React from "react";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { LeftSidebarCollapsible } from "./collapsible";
import { ImageWithFallback } from "../../../../components";
import { Icons } from "@instill-ai/design-system";
import { isGeneralNode, isIteratorNode } from "../../lib";
import { FitView } from "reactflow";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
});

export const ComponentSection = ({ fitView }: { fitView?: FitView }) => {
  const { nodes } = useInstillStore(useShallow(selector));

  return (
    <LeftSidebarCollapsible title="Components">
      {nodes.map((node) => {
        let icon: Nullable<React.ReactElement> = null;

        if (isIteratorNode(node)) {
          icon = (
            <ImageWithFallback
              src={`/icons/iterator.svg`}
              width={16}
              height={16}
              alt="iterator-icon"
              fallbackImg={
                <Icons.Box className="h-4 w-4 stroke-semantic-fg-primary" />
              }
            />
          );
        } else if (isGeneralNode(node)) {
          icon = (
            <ImageWithFallback
              src={`/icons/${node.data.definition?.id}.svg`}
              width={16}
              height={16}
              alt={`${node.data.definition?.title}-icon`}
              fallbackImg={
                <Icons.Box className="h-4 w-4 stroke-semantic-fg-primary" />
              }
            />
          );
        }

        return (
          <button
            type="button"
            key={node.id}
            className="flex flex-row items-center gap-x-2"
            onClick={() => {
              if (!node.id) return;
              if (fitView) {
                fitView({
                  nodes: [{ id: node.id }],
                  duration: 500,
                });
              }
            }}
          >
            {icon}
            <span className="text-semantic-fg-primary product-body-text-4-medium">
              {node.id}
            </span>
          </button>
        );
      })}
    </LeftSidebarCollapsible>
  );
};
