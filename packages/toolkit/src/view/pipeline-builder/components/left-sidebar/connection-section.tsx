import { FitView } from "reactflow";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { groupBy } from "../../../../server";
import { LeftSidebarCollapsible } from "./collapsible";

const selector = (store: InstillStore) => ({
  edges: store.edges,
});

export const ConnectionSection = ({ fitView }: { fitView?: FitView }) => {
  const { edges } = useInstillStore(useShallow(selector));

  return (
    <LeftSidebarCollapsible title="Connections">
      {Object.entries(groupBy(edges, (edge) => edge.source)).map(
        ([source, edges]) => (
          <div key={source} className="flex w-full flex-col gap-y-1">
            <p className="text-semantic-fg-primary product-body-text-3-medium">
              {source}
            </p>
            <div className="flex flex-col gap-y-3">
              {edges.map((edge) => (
                <button
                  key={`${edge.source}-${edge.target}`}
                  onClick={() => {
                    if (fitView) {
                      fitView({
                        nodes: [{ id: edge.source }, { id: edge.target }],
                        duration: 500,
                      });
                    }
                  }}
                  className="mr-auto px-2 py-1 text-semantic-fg-primary product-body-text-4-regular hover:bg-semantic-accent-bg"
                >
                  {`${edge.source} -> ${edge.target}`}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </LeftSidebarCollapsible>
  );
};
