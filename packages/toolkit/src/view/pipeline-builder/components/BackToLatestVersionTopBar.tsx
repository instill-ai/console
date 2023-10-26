import { shallow } from "zustand/shallow";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import { Nullable } from "../../../lib";
import {
  createGraphLayout,
  createInitialGraphData,
  useSortedReleases,
} from "../lib";

const selector = (state: PipelineBuilderStore) => ({
  pipelineName: state.pipelineName,
  pipelineIsNew: state.pipelineIsNew,
  updateCurrentVersion: state.updateCurrentVersion,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  currentVersion: state.currentVersion,
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
  } = usePipelineBuilderStore(selector, shallow);

  const sortedReleases = useSortedReleases({
    pipelineName,
    accessToken,
    enableQuery: pipelineIsNew ? false : enableQuery,
  });

  return (
    <>
      {currentVersion === "latest" || sortedReleases.length === 0 ? null : (
        <div className="flex flex-col bg-semantic-bg-base-bg w-full h-8">
          <p className="m-auto">
            <span className="product-body-text-4-medium text-semantic-fg-secondary ">
              You are viewing a past version of this pipeline, which is not
              editable.
            </span>
            {` `}
            <span
              className="hover:!underline text-semantic-accent-default cursor-pointer product-body-text-4-medium"
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
            <span className="product-body-text-4-medium text-semantic-fg-secondary">
              for the latest version.
            </span>
          </p>
        </div>
      )}
    </>
  );
};
