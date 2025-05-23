"use client";

import * as React from "react";
import { InstillNameInterpreter } from "instill-sdk";
import { Edge, Node } from "reactflow";
import { useShallow } from "zustand/react/shallow";

import {
  Button,
  cn,
  Icons,
  Popover,
  ScrollArea,
} from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useSortedReleases,
} from "../../../lib";
import { getHumanReadableStringFromTime } from "../../../server";
import {
  checkIsValidPosition,
  composeEdgesFromNodes,
  createGraphLayout,
} from "../lib";
import { createNodesFromPipelineRecipe } from "../lib/createNodesFromPipelineRecipe";
import { NodeData } from "../type";

const selector = (store: InstillStore) => ({
  pipelineName: store.pipelineName,
  pipelineIsNew: store.pipelineIsNew,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  currentVersion: store.currentVersion,
  updateCurrentVersion: store.updateCurrentVersion,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  isEditingIterator: store.isEditingIterator,
});

export const BottomBar = () => {
  const {
    pipelineIsNew,
    pipelineName,
    updateNodes,
    updateEdges,
    currentVersion,
    updateCurrentVersion,
    updateSelectedConnectorNodeId,
    accessToken,
    enabledQuery,
    isEditingIterator,
  } = useInstillStore(useShallow(selector));

  const sortedReleases = useSortedReleases({
    namespaceId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).namespaceId
      : null,
    pipelineId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).resourceId
      : null,
    accessToken,
    enabledQuery: pipelineIsNew ? false : enabledQuery && !!pipelineName,
    shareCode: null,
    view: "VIEW_FULL",
  });

  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    enabled:
      enabledQuery && routeInfo.isSuccess && !!pipelineName && !pipelineIsNew,
    accessToken,
    view: "VIEW_FULL",
    shareCode: null,
  });

  return (
    <div className="flex h-[var(--pipeline-builder-bottom-bar-height)] w-full flex-shrink-0 flex-row">
      {isEditingIterator ? null : (
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
            <ScrollArea.Root>
              <div className="flex flex-col gap-y-4">
                {sortedReleases.data.length > 0 ? (
                  <React.Fragment>
                    <VersionButton
                      id="latest"
                      currentVersion={currentVersion}
                      onClick={() => {
                        if (!pipeline.isSuccess || !pipeline.data.recipe) {
                          return;
                        }

                        updateCurrentVersion(() => "latest");

                        let newNodes: Node<NodeData>[] = [];
                        let newEdges: Edge[] = [];

                        if (
                          checkIsValidPosition({
                            component: pipeline.data.recipe.component ?? null,
                            metadata: pipeline.data.metadata ?? null,
                          })
                        ) {
                          const nodes = createNodesFromPipelineRecipe(
                            pipeline.data.recipe,
                            {
                              metadata: pipeline.data.metadata,
                            },
                          );
                          const edges = composeEdgesFromNodes(nodes);
                          newNodes = nodes;
                          newEdges = edges;
                        } else {
                          const nodes = createNodesFromPipelineRecipe(
                            pipeline.data.recipe,
                          );
                          const edges = composeEdgesFromNodes(nodes);
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
                    {sortedReleases.data.map((release) => (
                      <VersionButton
                        key={release.id}
                        id={release.id}
                        currentVersion={currentVersion}
                        createTime={release.createTime}
                        onClick={() => {
                          updateSelectedConnectorNodeId(() => null);

                          updateCurrentVersion(() => release.id);

                          let newNodes: Node<NodeData>[] = [];
                          let newEdges: Edge[] = [];

                          if (
                            checkIsValidPosition({
                              component: release.recipe.component ?? null,
                              metadata: release.metadata ?? null,
                            })
                          ) {
                            const nodes = createNodesFromPipelineRecipe(
                              release.recipe,
                              {
                                metadata: release.metadata,
                              },
                            );
                            const edges = composeEdgesFromNodes(nodes);

                            newNodes = nodes;
                            newEdges = edges;
                          } else {
                            const nodes = createNodesFromPipelineRecipe(
                              release.recipe,
                            );
                            const edges = composeEdgesFromNodes(nodes);
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
            </ScrollArea.Root>
          </Popover.Content>
        </Popover.Root>
      )}
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
        currentVersion === id ? "hover:!bg-semantic-accent-default" : "",
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
              : "text-semantic-fg-secondary",
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
                : "text-semantic-fg-disabled",
            )}
          >
            {getHumanReadableStringFromTime(createTime, Date.now())}
          </p>
        ) : null}
      </div>
    </Button>
  );
};
