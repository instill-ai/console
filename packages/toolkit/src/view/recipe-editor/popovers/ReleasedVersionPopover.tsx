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
  editorRef: store.editorRef,
});

export const ReleasedVersionPopover = ({
  editorContainerRef,
}: {
  editorContainerRef: React.RefObject<HTMLDivElement>;
}) => {
  const routeInfo = useRouteInfo();

  const {
    accessToken,
    enabledQuery,
    currentVersion,
    updateCurrentVersion,
    editorRef,
  } = useInstillStore(useShallow(selector));

  const sortedReleases = useSortedReleases({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    shareCode: null,
    view: "VIEW_FULL",
  });

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
    view: "VIEW_FULL",
    shareCode: null,
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
                  id="unversioned"
                  currentVersion={currentVersion}
                  onClick={() => {
                    if (
                      !pipeline.isSuccess ||
                      !editorRef ||
                      !editorContainerRef.current
                    ) {
                      return;
                    }

                    // We first update the value then update the version to latest
                    // Because the guard of the recipe updater will check whether the
                    // version is latest, if we don't have this delay, the updater will
                    // get wrongly trigger
                    editorRef.setValue(pipeline.data.rawRecipe ?? "");

                    // Because the past version hint is listening to the version change,
                    // so we need to bundle the layout update and version update together
                    setTimeout(() => {
                      if (!editorContainerRef.current) {
                        return;
                      }

                      const editorLayoutInfo = editorRef.getLayoutInfo();

                      const newHeight =
                        window.innerHeight -
                        editorContainerRef.current?.offsetTop -
                        // 40 is the height of the release popover and the gap at the bottom
                        40 +
                        // 52 is the height of the past version hint
                        52;

                      editorRef.layout({
                        width: editorLayoutInfo.width,
                        height: newHeight,
                      });
                      updateCurrentVersion(() => "latest");
                    }, 1);
                  }}
                />
                {sortedReleases.data.map((release) => (
                  <VersionButton
                    key={release.id}
                    id={release.id}
                    currentVersion={currentVersion}
                    createTime={release.createTime}
                    onClick={() => {
                      if (!editorRef || !editorContainerRef.current) {
                        return;
                      }

                      // We first update the current version to the release id,
                      // so the vscode updater will first know that we are in
                      // previous version and won't trigger update process, so we won't
                      // accidentally update the recipe to the previous version
                      updateCurrentVersion(() => release.id);

                      const editorLayoutInfo = editorRef.getLayoutInfo();

                      const newHeight =
                        window.innerHeight -
                        editorContainerRef.current.offsetTop -
                        // 52 is the height of the past version hint, and if the hint is already shown,
                        // we don't need to subtract the hint height
                        (currentVersion === "latest" ? 52 : 0) -
                        // 40 is the height of the release popover and the gap at the bottom
                        40;

                      editorRef.layout({
                        width: editorLayoutInfo.width,
                        height: newHeight,
                      });

                      setTimeout(() => {
                        editorRef.setValue(release.rawRecipe);
                      }, 1);
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
