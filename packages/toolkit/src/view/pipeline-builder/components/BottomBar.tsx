import * as React from "react";
import cn from "clsx";
import { useShallow } from "zustand/react/shallow";
import { Button, Icons, Popover } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  getHumanReadableStringFromTime,
  useInstillStore,
  useUserPipeline,
} from "../../../lib";
import {
  checkIsValidPosition,
  createGraphLayout,
  createInitialGraphData,
  useSortedReleases,
} from "../lib";
import { Edge, Node } from "reactflow";
import { NodeData } from "../type";
import { useRouter } from "next/router";

export type BottomBarProps = {
  enableQuery: boolean;
  accessToken: Nullable<string>;
};

const selector = (store: InstillStore) => ({
  pipelineName: store.pipelineName,
  pipelineIsNew: store.pipelineIsNew,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  currentVersion: store.currentVersion,
  updateCurrentVersion: store.updateCurrentVersion,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
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
  } = useInstillStore(useShallow(selector));

  const sortedReleases = useSortedReleases({
    pipelineName,
    accessToken,
    enabledQuery: pipelineIsNew ? false : enableQuery,
  });

  const router = useRouter();

  const { id, entity } = router.query;

  const pipeline = useUserPipeline({
    enabled: enableQuery && !!id && !pipelineIsNew,
    pipelineName: id ? `users/${entity}/pipelines/${id}` : null,
    accessToken,
    retry: false,
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
                    if (!pipeline.isSuccess) {
                      return;
                    }

                    updateCurrentVersion(() => "latest");

                    let newNodes: Node<NodeData>[] = [];
                    let newEdges: Edge[] = [];

                    if (
                      checkIsValidPosition(
                        pipeline.data.recipe,
                        pipeline.data.metadata ?? null
                      )
                    ) {
                      const { nodes, edges } = createInitialGraphData(
                        pipeline.data.recipe,
                        {
                          metadata: pipeline.data.metadata,
                        }
                      );
                      newNodes = nodes;
                      newEdges = edges;
                    } else {
                      const { nodes, edges } = createInitialGraphData(
                        pipeline.data.recipe
                      );
                      newNodes = nodes;
                      newEdges = edges;
                    }

                    createGraphLayout(newNodes, newEdges)
                      .then((graphData) => {
                        updateNodes(() => graphData.nodes);
                        updateEdges(() => graphData.edges);
                      })
                      .catch((err) => {
                        console.error(err);
                      });
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

                      let newNodes: Node<NodeData>[] = [];
                      let newEdges: Edge[] = [];

                      if (
                        checkIsValidPosition(
                          release.recipe,
                          release.metadata ?? null
                        )
                      ) {
                        const { nodes, edges } = createInitialGraphData(
                          release.recipe,
                          {
                            metadata: release.metadata,
                          }
                        );
                        newNodes = nodes;
                        newEdges = edges;
                      } else {
                        const { nodes, edges } = createInitialGraphData(
                          release.recipe
                        );
                        newNodes = nodes;
                        newEdges = edges;
                      }

                      createGraphLayout(newNodes, newEdges)
                        .then((graphData) => {
                          updateNodes(() => graphData.nodes);
                          updateEdges(() => graphData.edges);
                        })
                        .catch((err) => {
                          console.error(err);
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
