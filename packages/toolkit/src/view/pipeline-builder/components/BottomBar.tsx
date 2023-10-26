import * as React from "react";
import cn from "clsx";
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
              <React.Fragment>
                <VersionButton
                  id="latest"
                  currentVersion={currentVersion}
                  onClick={() => {
                    updateCurrentVersion(() => "latest");
                  }}
                />
                {sortedReleases.map((release, idx) => (
                  <VersionButton
                    key={release.id}
                    id={release.id}
                    currentVersion={currentVersion}
                    createTime={release.create_time}
                    onClick={() => {
                      updateSelectedConnectorNodeId(() => null);

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
                  />
                ))}
              </React.Fragment>
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
      </div>

      {/* 
        Placeholder
      */}

      <div className="w-[88px]"></div>
    </div>
  );
};

const VersionButton = ({
  id,
  currentVersion,
  onClick,
  createTime,
}: {
  id: string;
  currentVersion: Nullable<string>;
  createTime?: string;
  onClick: () => void;
}) => {
  return (
    <Button
      key={id}
      className={cn(
        "w-full",
        currentVersion === id ? "hover:!bg-semantic-accent-default" : ""
      )}
      variant={currentVersion === id ? "primary" : "tertiaryColour"}
      onClick={onClick}
    >
      <div className="flex flex-col w-full gap-y-2">
        <p
          className={cn(
            "product-body-text-3-medium w-full text-left",
            currentVersion === id
              ? "text-semantic-fg-on-default"
              : "text-semantic-fg-secondary"
          )}
        >
          {id}
        </p>
        {createTime ? (
          <p
            className={cn(
              "product-body-text-4-medium w-full text-left",
              currentVersion === id
                ? "text-semantic-fg-on-default"
                : "text-semantic-fg-disabled"
            )}
          >
            {getHumanReadableStringFromTime(createTime, Date.now())}
          </p>
        ) : null}
      </div>
    </Button>
  );
};
