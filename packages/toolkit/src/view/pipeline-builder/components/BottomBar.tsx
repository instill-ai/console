import { Button, Icons, Popover } from "@instill-ai/design-system";
import { Nullable, getHumanReadableStringFromTime } from "../../../lib";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import { shallow } from "zustand/shallow";
import {
  createGraphLayout,
  createInitialGraphData,
  useSortedReleases,
} from "../lib";

export type BottomBarProps = {
  enableQuery: boolean;
  accessToken: Nullable<string>;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  pipelineName: state.pipelineName,
  pipelineIsNew: state.pipelineIsNew,
  isLatestVersion: state.isLatestVersion,
  updateIsLatestVersion: state.updateIsLatestVersion,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  currentVersion: state.currentVersion,
  updateCurrentVersion: state.updateCurrentVersion,
  updateSelectedConnectorNodeId: state.updateSelectedConnectorNodeId,
});

export const BottomBar = (props: BottomBarProps) => {
  const { enableQuery, accessToken } = props;

  const {
    pipelineIsNew,
    pipelineName,
    isLatestVersion,
    updateIsLatestVersion,
    updateNodes,
    updateEdges,
    currentVersion,
    updateCurrentVersion,
    updateSelectedConnectorNodeId,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const sortedReleases = useSortedReleases({
    pipelineName,
    accessToken,
    enableQuery: pipelineIsNew ? false : enableQuery,
  });

  return (
    <div className="h-[var(--pipeline-builder-bottom-bar-height)] w-full flex-shrink-0 flex flex-row">
      <Popover.Root>
        <Popover.Trigger asChild={true}>
          <Button
            className="gap-x-2"
            size="sm"
            variant="tertiaryColour"
            type="button"
          >
            <Icons.Tag01 className="w-3 h-3 stroke-semantic-accent-default" />
            Releases
          </Button>
        </Popover.Trigger>
        <Popover.Content
          side="top"
          sideOffset={4}
          align="start"
          className="h-[386px] w-[220px] p-2 flex flex-col !rounded-none"
        >
          <p className="mb-[18px] text-semantic-fg-primary product-body-text-3-semibold">
            Releases
          </p>
          <div className="flex flex-col gap-y-4">
            {sortedReleases.length > 0 ? (
              sortedReleases.map((release, idx) => (
                <Button
                  key={release.id}
                  className="w-full"
                  variant="tertiaryGrey"
                  onClick={() => {
                    if (idx !== 0) {
                      updateIsLatestVersion(() => false);
                    } else {
                      updateIsLatestVersion(() => true);
                    }

                    if (release.id === sortedReleases[0].id) {
                      updateIsLatestVersion(() => true);
                    } else {
                      updateSelectedConnectorNodeId(() => null);
                    }

                    updateCurrentVersion(() => release.id);

                    const { nodes, edges } = createInitialGraphData(
                      release.recipe
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
                  <div className="flex flex-col w-full">
                    <p className="mb-2 product-body-text-3-medium w-full text-left text-semantic-fg-primary">
                      {release.id}
                    </p>
                    <p className="product-body-text-4-medium w-full text-left text-semantic-fg-disabled">
                      {getHumanReadableStringFromTime(
                        release.create_time,
                        Date.now()
                      )}
                    </p>
                  </div>
                </Button>
              ))
            ) : (
              <div className="product-body-text-4-medium text-semantic-fg-disabled">
                This pipeline has no released versions.
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Root>
      <div className="flex-1 flex flex-row gap-x-2 my-auto justify-center">
        <p className="product-body-text-4-medium text-semantic-fg-secondary">
          Pipeline {currentVersion ? `(${currentVersion})` : null}
        </p>
        {isLatestVersion ? (
          <p className="product-body-text-4-medium text-semantic-accent-default">
            latest
          </p>
        ) : null}
      </div>

      {/* 
        Placeholder
      */}

      <div className="w-[88px]"></div>
    </div>
  );
};
