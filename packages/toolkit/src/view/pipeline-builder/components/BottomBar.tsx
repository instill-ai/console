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
    <div className="flex h-[var(--pipeline-builder-bottom-bar-height)] w-full flex-shrink-0 flex-row">
      <Popover.Root>
        <Popover.Trigger asChild={true}>
          <Button
            className="gap-x-2"
            size="sm"
            variant="tertiaryColour"
            type="button"
          >
            <Icons.Tag01 className="h-3 w-3 stroke-semantic-accent-default" />
            Releases
          </Button>
        </Popover.Trigger>
        <Popover.Content
          side="top"
          sideOffset={4}
          align="start"
          className="flex h-[386px] w-[220px] flex-col !rounded-none p-2"
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
                {sortedReleases.map((release) => (
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
              <div className="text-semantic-fg-disabled product-body-text-4-medium">
                This pipeline has no released versions.
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Root>
      <div className="my-auto flex flex-1 flex-row justify-center gap-x-2">
        <p className="text-semantic-fg-secondary product-body-text-4-medium">
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
      <div className="flex w-full flex-col gap-y-2">
        <p
          className={cn(
            "w-full text-left product-body-text-3-medium",
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
              "w-full text-left product-body-text-4-medium",
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
