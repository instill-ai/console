"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

import {
  Button,
  cn,
  Icons,
  Popover,
  ScrollArea,
} from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
  useSortedReleases,
} from "../../../lib";
import { getHumanReadableStringFromTime } from "../../../server";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  currentVersion: store.currentVersion,
  updateCurrentVersion: store.updateCurrentVersion,
  updateRawRecipeOnDom: store.updateRawRecipeOnDom,
  editorRef: store.editorRef,
});

export const ReleasedVersionPopover = () => {
  const routeInfo = useRouteInfo();

  const {
    accessToken,
    enabledQuery,
    currentVersion,
    updateCurrentVersion,
    updateRawRecipeOnDom,
    editorRef,
  } = useInstillStore(useShallow(selector));

  const sortedReleases = useSortedReleases({
    pipelineName: routeInfo.data.pipelineName,
    accessToken,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
  });

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.data.pipelineName,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  return (
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
                    if (!pipeline.isSuccess) {
                      return;
                    }

                    updateCurrentVersion(() => "latest");
                    updateRawRecipeOnDom(() => pipeline.data.rawRecipe);

                    if (!editorRef) {
                      return;
                    }

                    const editorWidth = editorRef.getLayoutInfo().width;
                    editorRef.layout({
                      width: editorWidth,
                      // We give a random number to let the editor recalculate the height
                      height: 1,
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
                      updateCurrentVersion(() => release.id);
                      updateRawRecipeOnDom(() => release.rawRecipe);

                      if (!editorRef) {
                        return;
                      }

                      const editorWidth = editorRef.getLayoutInfo().width;
                      editorRef.layout({
                        width: editorWidth,
                        // We give a random number to let the editor recalculate the height
                        height: 1,
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
