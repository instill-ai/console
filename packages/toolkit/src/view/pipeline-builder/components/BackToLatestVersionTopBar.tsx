import { useShallow } from "zustand/react/shallow";

import { InstillStore, Nullable, useInstillStore } from "../../../lib";
import {
  createGraphLayout,
  createInitialGraphData,
  useSortedReleases,
} from "../lib";

const selector = (store: InstillStore) => ({
  pipelineName: store.pipelineName,
  pipelineIsNew: store.pipelineIsNew,
  updateCurrentVersion: store.updateCurrentVersion,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  currentVersion: store.currentVersion,
});

export type BackToLatestVersionTopBarProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const BackToLatestVersionTopBar = (
  props: BackToLatestVersionTopBarProps
) => {
  const { accessToken, enableQuery } = props;
  const {
    pipelineName,
    pipelineIsNew,
    updateCurrentVersion,
    updateNodes,
    updateEdges,
    currentVersion,
  } = useInstillStore(useShallow(selector));

  const sortedReleases = useSortedReleases({
    pipelineName,
    accessToken,
    enableQuery: pipelineIsNew ? false : enableQuery,
  });

  return (
    <>
      {currentVersion === "latest" || sortedReleases.length === 0 ? null : (
        <div className="flex h-8 w-full flex-col bg-semantic-bg-base-bg">
          <p className="m-auto">
            <span className="text-semantic-fg-secondary product-body-text-4-medium ">
              You are viewing a past version of this pipeline, which is not
              editable.
            </span>
            {` `}
            <span
              className="cursor-pointer text-semantic-accent-default product-body-text-4-medium hover:!underline"
              onClick={() => {
                if (sortedReleases.length === 0) {
                  return;
                }

                updateCurrentVersion(() => "latest");

                const { nodes, edges } = createInitialGraphData(
                  sortedReleases[0].recipe
                );

                createGraphLayout(nodes, edges)
                  .then((graphData) => {
                    updateNodes(() => graphData.nodes);
                    updateEdges(() => graphData.edges);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Click Here
            </span>
            {` `}
            <span className="text-semantic-fg-secondary product-body-text-4-medium">
              for the latest version.
            </span>
          </p>
        </div>
      )}
    </>
  );
};
